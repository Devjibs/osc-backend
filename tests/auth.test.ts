// @ts-nocheck
import 'reflect-metadata';
import request from 'supertest';
import { startTestServer, stopTestServer } from './setupTestServer.test';
import redis from '../src/utils/redis';

let server: any;
let url: string;
let adminToken: string;
let userToken: string;
let courseId: string;

beforeAll(async () => {
  await redis.flushall();
  ({ server, url } = await startTestServer());

  const uniqueAdminUsername = `admin_${Date.now()}`;
  const uniqueUserUsername = `user_${Date.now()}`;

  // Register Admin User
  const adminRes = await request(url)
    .post('/graphql')
    .send({
      query: `mutation { register(username: "${uniqueAdminUsername}", password: "adminpass", role: "ADMIN") { message } }`,
    });

  console.log('🔹 Admin Register Response:', adminRes.body);
  if (adminRes.body.errors) throw new Error('Admin registration failed');

  // 🔹 Log in Admin to Get Token
  const adminLoginRes = await request(url)
    .post('/graphql')
    .send({
      query: `mutation { login(username: "${uniqueAdminUsername}", password: "adminpass") }`,
    });

  console.log('🔹 Admin Login Response:', adminLoginRes.body);
  if (adminLoginRes.body.errors) throw new Error('Admin login failed');
  adminToken = adminLoginRes.body.data.login; // ✅ Store Admin Token

  // Register Regular User
  const userRes = await request(url)
    .post('/graphql')
    .send({
      query: `mutation { register(username: "${uniqueUserUsername}", password: "userpass", role: "USER") { message } }`,
    });

  console.log('🔹 User Register Response:', userRes.body);
  if (userRes.body.errors) throw new Error('User registration failed');

  // 🔹 Log in User to Get Token
  const userLoginRes = await request(url)
    .post('/graphql')
    .send({
      query: `mutation { login(username: "${uniqueUserUsername}", password: "userpass") }`,
    });

  console.log('🔹 User Login Response:', userLoginRes.body);
  if (userLoginRes.body.errors) throw new Error('User login failed');
  userToken = userLoginRes.body.data.login; // ✅ Store User Token

  console.log('🔹 User Register Response:', userRes.body);
  if (userRes.body.errors) throw new Error('User registration failed');
  expect(userRes.body.data.register).toEqual({
    message: 'Registration successful',
  });
});

afterAll(async () => {
  await stopTestServer(server);
});

describe('Role-Based Authorization Tests', () => {
  it('should allow admin to add a course', async () => {
    const res = await request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        query: `
          mutation {
            addCourse(input: { 
              title: "Admin Course", 
              description: "Created by Admin", 
              duration: "6 weeks", 
              outcome: "Master Admin" 
            }) {
              id
              title
            }
          }
        `,
      });

    console.log('🔹 Add Course Response:', res.body);
    expect(res.body.errors).toBeUndefined();
    courseId = res.body.data.addCourse.id;
  });

  it('should allow user to add a course', async () => {
    const res = await request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        query: `
          mutation {
            addCourse(input: { 
              title: "User Course", 
              description: "Created by User", 
              duration: "6 weeks", 
              outcome: "Master User" 
            }) {
              id
              title
            }
          }
        `,
      });

    console.log('🔹 User Add Course Response:', res.body);
    expect(res.body.errors).toBeUndefined();
  });

  it('should not allow a regular user to delete a course', async () => {
    const res = await request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ query: `mutation { deleteCourse(id: "${courseId}") }` });

    console.log('🔹 Unauthorized Delete Course Response:', res.body);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toMatch(/Permission denied/i);
  });

  it('should allow admin to delete a course', async () => {
    const res = await request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: `mutation { deleteCourse(id: "${courseId}") }` });

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.deleteCourse).toBe(true);
  });
});

afterAll(async () => {
  if (redis.status === 'ready' || redis.status === 'connecting') {
    await redis.quit().catch((err) => {});
  }
});
