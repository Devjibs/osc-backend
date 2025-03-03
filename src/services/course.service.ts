import { prisma } from '../utils/prisma';
import { CourseInput } from '../schema/CourseInput';
import redis from '../utils/redis';

const isTestEnv = process.env.NODE_ENV === 'test';

export class CourseService {
  static async getCourses(limit?: number) {
    const cacheKey = `courses:${limit ?? 'all'}`;

    if (!isTestEnv) {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log('🔹 Serving from Redis Cache');
        return JSON.parse(cachedData);
      }
    }

    const courses = await prisma.course.findMany({ take: limit });

    if (!isTestEnv) {
      await redis.setex(cacheKey, 600, JSON.stringify(courses));
    }

    return courses;
  }

  static async addCourse(input: CourseInput, userId: string) {
    return prisma.course.create({
      data: {
        ...input,
        createdById: userId,
      },
    });
  }

  static async updateCourse(id: string, input: CourseInput) {
    return prisma.course.update({
      where: { id },
      data: input,
    });
  }

  static async deleteCourse(id: string) {
    await prisma.course.delete({ where: { id } });
    return true;
  }
}
