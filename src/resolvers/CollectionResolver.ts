import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
} from 'type-graphql';
import { isAuthenticated } from '../middleware/auth';
import { Collection } from '../schema/Collection';
import { prisma } from '../utils/prisma';

@InputType()
class CollectionInput {
  @Field()
  name!: string;
}

@Resolver()
export class CollectionResolver {
  @Query(() => [Collection])
  async collections(): Promise<Collection[]> {
    return prisma.collection.findMany({ include: { courses: true } });
  }

  @Query(() => Collection, { nullable: true })
  async collection(@Arg('id') id: string): Promise<Collection | null> {
    return prisma.collection.findUnique({
      where: { id },
      include: { courses: true },
    });
  }

  @Mutation(() => Collection)
  @UseMiddleware(isAuthenticated)
  async addCollection(
    @Arg('input') input: CollectionInput,
  ): Promise<Collection> {
    return prisma.collection.create({ data: input });
  }

  @Mutation(() => Collection)
  @UseMiddleware(isAuthenticated)
  async updateCollection(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Ctx() ctx: any,
  ): Promise<Collection> {
    if (ctx.user.role !== 'ADMIN') {
      throw new Error('Not authorized');
    }

    return prisma.collection.update({ where: { id }, data: { name } });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteCollection(
    @Arg('id') id: string,
    @Ctx() ctx: any,
  ): Promise<boolean> {
    if (ctx.user.role !== 'ADMIN') {
      throw new Error('Not authorized');
    }

    await prisma.collection.delete({ where: { id } });
    return true;
  }
}
