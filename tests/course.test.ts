// @ts-nocheck
import 'reflect-metadata';
import request from 'supertest';
import { startTestServer, stopTestServer } from './setupTestServer.test';
import redis from '../src/utils/redis';

let server: any;
let url: string;
let token: string;
let adminToken: string;

beforeAll(async () => {
  await redis.flushall();
  ({ server, url } = await startTestServer());

  // Register Admin User
  const adminRes = await request(url).post('/graphql').send({
    query: `mutation { register(username: "admin", password: "adminpass", role: "ADMIN") { message } }`,
  });

  console.log('🔹 Admin Register Response:', adminRes.body);
  if (adminRes.body.errors) throw new Error('Admin registration failed');

  // Log in the Admin User to Get Token
  const adminLoginRes = await request(url).post('/graphql').send({
    query: `mutation { login(username: "admin", password: "adminpass") }`,
  });

  console.log('🔹 Admin Login Response:', adminLoginRes.body);
  if (adminLoginRes.body.errors) throw new Error('Admin login failed');
  adminToken = adminLoginRes.body.data.login;

  // Register Regular User
  const userRes = await request(url).post('/graphql').send({
    query: `mutation { register(username: "testuser", password: "testpassword", role: "USER") { message } }`,
  });

  console.log('🔹 User Register Response:', userRes.body);
  if (userRes.body.errors) throw new Error('User registration failed');

  // Log in User to Get Token
  const userLoginRes = await request(url).post('/graphql').send({
    query: `mutation { login(username: "testuser", password: "testpassword") }`,
  });

  console.log('🔹 User Login Response:', userLoginRes.body);
  if (userLoginRes.body.errors) throw new Error('User login failed');
  token = userLoginRes.body.data.login;
});

afterAll(async () => {
  await stopTestServer(server);
});

describe('Course API Tests', () => {
  let courseId: string;

  it('should add a course', async () => {
    const res = await request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation {
            addCourse(input: { 
              title: "GraphQL Basics", 
              description: "Intro course", 
              duration: "6 weeks", 
              outcome: "Master GraphQL" 
            }) {
              id
              title
            }
          }
        `,
      });

    console.log('🔹 Add Course Response:', res.body);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.addCourse.id).toBeDefined();
    courseId = res.body.data.addCourse.id;
  });

  it('should retrieve all courses', async () => {
    const res = await request(url)
      .post('/graphql')
      .send({
        query: `
          {
            courses {
              id
              title
            }
          }
        `,
      });

    console.log('🔹 Retrieve Courses Response:', res.body);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.courses).toBeDefined();
    expect(res.body.data.courses.length).toBeGreaterThan(0);
  });

  it('should retrieve a specific course', async () => {
    const res = await request(url)
      .post('/graphql')
      .send({
        query: `
          query {
            courses {
              id
              title
              description
            }
          }
        `,
      });

    console.log('🔹 All Retrieved Courses:', res.body.data.courses);

    expect(res.body.errors).toBeUndefined();

    const retrievedCourse = res.body.data.courses.find(
      (c: any) => c.id === courseId,
    );

    console.log('🔹 Expected Course ID:', courseId);
    console.log('🔹 Retrieved Course:', retrievedCourse);

    // Ensure course exists
    expect(retrievedCourse).toBeDefined();
    expect(retrievedCourse.title).toBe('GraphQL Basics');
  });

  it('should update a course', async () => {
    const res = await request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation {
            updateCourse(id: "${courseId}", input: { 
              title: "Advanced GraphQL", 
              description: "Deep dive", 
              duration: "8 weeks", 
              outcome: "Expert level" 
            }) {
              title
            }
          }
        `,
      });

    console.log('🔹 Update Course Response:', res.body);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.updateCourse.title).toBe('Advanced GraphQL');
  });

  it('should delete a course as admin', async () => {
    const res = await request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        query: `
          mutation {
            deleteCourse(id: "${courseId}")
          }
        `,
      });

    console.log('🔹 Delete Course Response:', res.body);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.deleteCourse).toBe(true);
  });

  it('should return null for a deleted course', async () => {
    const res = await request(url)
      .post('/graphql')
      .send({
        query: `
          {
            courses {
              id
            }
          }
        `,
      });

    console.log('🔹 Retrieve Deleted Course Response:', res.body);
    expect(res.body.errors).toBeUndefined();

    const deletedCourse = res.body.data.courses.find(
      (c: any) => c.id === courseId,
    );
    expect(deletedCourse).toBeUndefined();
  });
});

afterAll(async () => {
  if (redis.status === 'ready' || redis.status === 'connecting') {
    await redis.quit().catch((err) => {});
  }
});
