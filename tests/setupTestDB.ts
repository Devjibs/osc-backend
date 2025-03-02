import { execSync } from 'child_process';
import { prisma } from '../src/utils/prisma';

module.exports = async () => {
  console.log('Resetting Test Database...');
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.collection.deleteMany();

  execSync('pnpm prisma migrate reset --force --schema=prisma/schema.prisma', {
    stdio: 'inherit',
  });

  console.log('Test Database Ready!');
};
