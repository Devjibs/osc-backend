import { PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';

export const prisma = new PrismaClient();

const batchUsers = async (
  userIds: ReadonlyArray<string>,
): Promise<(User | null)[]> => {
  const users = await prisma.user.findMany({
    where: { id: { in: [...userIds] } },
  });

  const userMap = new Map(users.map((user) => [user.id, user]));
  return userIds.map((id) => userMap.get(id) ?? null);
};

export const userLoader = new DataLoader<string, User | null>(batchUsers);
