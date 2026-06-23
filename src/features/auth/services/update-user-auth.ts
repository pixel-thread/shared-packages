import { Prisma } from '@prisma/client';
import { prisma } from '@items/prisma/client';

// ---- Types ----

/** Props for updating a single user auth. */
export type Props = Prisma.UserAuthUpdateArgs;

// ---- Functions ----
export async function updateUserAuth(props: Props) {
  return await prisma.userAuth.update(props);
}
