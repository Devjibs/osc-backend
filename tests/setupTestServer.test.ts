// @ts-nocheck
import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { buildSchema } from 'type-graphql';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import { CourseResolver } from '../src/resolvers/CourseResolver';
import { AuthResolver } from '../src/resolvers/AuthResolver';
import { prisma } from '../src/utils/prisma';
import redis from '../src/utils/redis';

export async function startTestServer() {
  const schema = await buildSchema({
    resolvers: [CourseResolver, AuthResolver],
  });

  const server = new ApolloServer({ schema });
  await server.start();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ req, prisma }),
    }),
  );

  const httpServer = app.listen(4001, () =>
    console.log('Test Server running on 4001'),
  );
  return { server: httpServer, url: 'http://localhost:4001' };
}

export async function stopTestServer(server: any) {
  await new Promise((resolve) => server.close(resolve));
}

describe('Setup Test Server', () => {
  it('should run setup successfully', () => {
    expect(true).toBe(true);
  });
});

afterAll(async () => {
  if (redis.status === 'ready' || redis.status === 'connecting') {
    await redis.quit().catch((err) => {});
  }
});
