import 'reflect-metadata';
import express, { RequestHandler } from 'express';
import { ApolloServer } from '@apollo/server';
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client/index';
import * as dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();

const prisma = new PrismaClient();

import { CourseResolver } from './resolvers/CourseResolver';
import { AuthResolver } from './resolvers/AuthResolver';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [CourseResolver, AuthResolver],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }: ExpressContextFunctionArgument) => {
        return { req, prisma };
      },
    }) as RequestHandler,
  );

  app.listen(4000, () =>
    console.log('🚀 Server running at http://localhost:4000/graphql'),
  );
}

startServer();
