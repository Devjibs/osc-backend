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
import { userLoader } from '../utils/prisma';
import { Course } from '../schema/Course';
import { CourseInput } from '../schema/CourseInput';
import { isAuthenticated } from '../middleware/auth';
import { isOwnerOrAdmin, isAdmin } from '../utils/auth';
import { User } from '../schema/User';
import { Context } from 'vm';
import { CourseService } from '../services/course.service';

@Resolver(() => Course)
export class CourseResolver {
  @Query(() => [Course])
  async courses(
    @Arg('limit', { nullable: true }) limit?: number,
  ): Promise<Course[]> {
    return await CourseService.getCourses(limit);
  }

  @FieldResolver(() => User)
  async createdBy(@Root() course: Course): Promise<User | null> {
    return await userLoader.load(course.createdById);
  }

  @Mutation(() => Course)
  @UseMiddleware(isAuthenticated)
  async addCourse(
    @Arg('input', () => CourseInput) input: CourseInput,
    @Ctx() context: Context,
  ): Promise<Course> {
    return await CourseService.addCourse(input, context.user.userId);
  }

  @Mutation(() => Course)
  @UseMiddleware(isAuthenticated, isOwnerOrAdmin)
  async updateCourse(
    @Arg('id') id: string,
    @Arg('input', () => CourseInput) input: CourseInput,
  ): Promise<Course> {
    return await CourseService.updateCourse(id, input);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated, isAdmin)
  async deleteCourse(@Arg('id') id: string): Promise<boolean> {
    return await CourseService.deleteCourse(id);
  }
}
