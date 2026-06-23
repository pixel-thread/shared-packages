import { Prisma } from '@prisma/client';
import { prisma } from '@items/lib/prisma';

type Props = Prisma.UserCreateArgs;

export async function createUser(props: Props) {
  return await prisma.user.create(props);
}
