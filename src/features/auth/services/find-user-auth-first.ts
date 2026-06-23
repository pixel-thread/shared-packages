import { Prisma } from '@prisma/client';
import { prisma } from '@items/prisma/client';

type Props = Prisma.UserAuthFindFirstArgs;

export async function findUserAuthFirst(props: Props) {
  return await prisma.userAuth.findFirst(props);
}
