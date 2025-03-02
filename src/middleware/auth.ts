import { MiddlewareFn } from 'type-graphql';
import { verifyToken } from '../utils/auth';

export const isAuthenticated: MiddlewareFn<any> = ({ context }, next) => {
  let token = context.req.headers.authorization;

  if (!token) throw new Error('Unauthorized');

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  const user = verifyToken(token);
  if (!user) throw new Error('Invalid token');

  context.user = user;
  return next();
};
