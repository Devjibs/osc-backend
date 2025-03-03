import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { Role } from '@prisma/client';
import { tokenExpiration } from '../utils/jwt';
import { RegisterResponse } from '../models/register.response';

export class AuthService {
  static async register(
    username: string,
    password: string,
    role: Role = Role.USER,
  ): Promise<RegisterResponse> {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    return { message: 'Registration successful' };
  }

  static async login(username: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    return AuthService.generateToken(user.id, user.role);
  }

  private static generateToken(userId: string, role: string): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
      { userId: userId, role: role },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: tokenExpiration(),
      },
    );
  }
}
