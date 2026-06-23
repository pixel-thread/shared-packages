import { Prisma } from '@prisma/client';
import { prisma } from '@items/lib/prisma';

type Props = Prisma.UserFindFirstArgs;

export async function findUserAuthFirst(props: Props) {
  return await prisma.user.findFirst(props);
}
