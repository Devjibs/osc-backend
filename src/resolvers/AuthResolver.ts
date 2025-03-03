import { Arg, Mutation, Resolver } from 'type-graphql';
import { AuthService } from '../services/auth.service';
import { Role } from '@prisma/client';

@Resolver()
export class AuthResolver {
  @Mutation(() => String)
  async register(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Arg('role', { nullable: true }) role?: Role,
  ): Promise<string> {
    return await AuthService.register(username, password, role);
  }

  @Mutation(() => String)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
  ): Promise<string> {
    return await AuthService.login(username, password);
  }
}
