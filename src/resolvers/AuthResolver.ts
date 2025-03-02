import { Arg, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

@Resolver()
export class AuthResolver {
  @Mutation(() => String)
  async register(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Arg('role', { nullable: true }) role?: 'ADMIN' | 'USER',
  ): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role: role || 'USER',
        },
      });

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1h',
        },
      );

      console.log('Register Success:', token);
      return token;
    } catch (error) {
      console.error('Register Error:', error);
      throw new Error('Registration failed');
    }
  }

  @Mutation(() => String)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
  ): Promise<string> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: '1h',
      },
    );
  }
}
