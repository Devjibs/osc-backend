import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  UseMiddleware,
} from 'type-graphql';
import { isAuthenticated } from '../middleware/auth';
import { Collection } from '../schema/Collection';
import { CollectionService } from '../services/collection.service';
import { CollectionInput } from '../schema/CollectionInput';
import { Role } from '@prisma/client';

@Resolver()
export class CollectionResolver {
  @Query(() => [Collection])
  async collections(): Promise<Collection[]> {
    return await CollectionService.getCollections();
  }

  @Query(() => Collection, { nullable: true })
  async collection(@Arg('id') id: string): Promise<Collection | null> {
    return await CollectionService.getCollection(id);
  }

  @Mutation(() => Collection)
  @UseMiddleware(isAuthenticated)
  async addCollection(
    @Arg('input') input: CollectionInput,
  ): Promise<Collection> {
    return await CollectionService.addCollection(input);
  }

  @Mutation(() => Collection)
  @UseMiddleware(isAuthenticated)
  async updateCollection(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Ctx() ctx: any,
  ): Promise<Collection> {
    if (ctx.user.role !== Role.ADMIN) {
      throw new Error('Not authorized');
    }
    return await CollectionService.updateCollection(id, name);
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
    return await CollectionService.deleteCollection(id);
  }
}
