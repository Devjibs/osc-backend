import { CollectionInput } from '../schema/CollectionInput';
import { prisma } from '../utils/prisma';

export class CollectionService {
  static async getCollections() {
    return prisma.collection.findMany({ include: { courses: true } });
  }

  static async getCollection(id: string) {
    return prisma.collection.findUnique({
      where: { id },
      include: { courses: true },
    });
  }

  static async addCollection(input: CollectionInput) {
    return prisma.collection.create({ data: input });
  }

  static async updateCollection(id: string, name: string) {
    return prisma.collection.update({ where: { id }, data: { name } });
  }

  static async deleteCollection(id: string) {
    await prisma.collection.delete({ where: { id } });
    return true;
  }
}
