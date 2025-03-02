import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MiddlewareFn } from 'type-graphql';
import { Context } from 'vm';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET ?? 'super-secure-secret';

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, 10);

export const comparePasswords = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const generateToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' });

export const verifyToken = (token: string) => {
  try {
    console.log('🔹 Verifying Token:', token);
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('❌ Token Verification Failed:');
    throw new Error('Invalid or expired token');
  }
};

export const isAdmin: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.user) {
    throw new Error('Unauthorized');
  }

  if (context.user.role !== 'ADMIN') {
    throw new Error('Permission denied');
  }

  return next();
};

export const isOwnerOrAdmin: MiddlewareFn<Context> = async (
  { context, args },
  next,
) => {
  if (!context.user) throw new Error('Unauthorized');

  const course = await prisma.course.findUnique({ where: { id: args.id } });
  if (!course) throw new Error('Course not found');

  if (
    context.user.role !== 'ADMIN' &&
    course.createdById !== context.user.userId
  ) {
    throw new Error('Permission denied');
  }

  return next();
};
