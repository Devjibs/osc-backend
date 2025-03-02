import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';
import { prisma, userLoader } from '../utils/prisma';
import { Course } from '../schema/Course';
import { CourseInput } from '../schema/CourseInput';
import { isAuthenticated } from '../middleware/auth';
import { isOwnerOrAdmin, isAdmin } from '../utils/auth';
import { User } from '../schema/User';
import redis from '../utils/redis';
import { Context } from 'vm';

const isTestEnv = process.env.NODE_ENV === 'test';

@Resolver(() => Course)
export class CourseResolver {
  @Query(() => [Course])
  async courses(
    @Arg('limit', { nullable: true }) limit?: number,
  ): Promise<Course[]> {
    const cacheKey = `courses:${limit ?? 'all'}`;

    if (!isTestEnv) {
      // Disable Redis caching in test mode
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log('🔹 Serving from Redis Cache');
        return JSON.parse(cachedData);
      }
    }

    // Fetch courses from database
    const courses = await prisma.course.findMany({ take: limit });

    if (!isTestEnv) {
      await redis.setex(cacheKey, 600, JSON.stringify(courses));
    }

    return courses;
  }

  @FieldResolver(() => User)
  async createdBy(
    @Root() course: Course,
    @Ctx() context: Context,
  ): Promise<User | null> {
    return await userLoader.load(course.createdById);
  }

  @Mutation(() => Course)
  @UseMiddleware(isAuthenticated)
  async addCourse(
    @Arg('input', () => CourseInput) input: CourseInput,
    @Ctx() context: Context,
  ): Promise<Course> {
    return prisma.course.create({
      data: {
        ...input,
        createdById: context.user.userId,
      },
    });
  }

  @Mutation(() => Course)
  @UseMiddleware(isAuthenticated, isOwnerOrAdmin)
  async updateCourse(
    @Arg('id') id: string,
    @Arg('input', () => CourseInput) input: CourseInput,
  ): Promise<Course> {
    return prisma.course.update({
      where: { id },
      data: input,
    });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated, isAdmin)
  async deleteCourse(@Arg('id') id: string): Promise<boolean> {
    await prisma.course.delete({ where: { id } });
    return true;
  }
}
