import * as crypto from 'crypto';
import { prisma } from '@items/prisma/client';

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  },

  async createResetToken(id: string) {
    const token = crypto.randomUUID();
    await prisma.passwordReset.create({
      data: {
        userId: id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    return token;
  },

  async findByResetToken(token: string) {
    return prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });
  },

  async deleteResetToken(token: string) {
    return prisma.passwordReset.delete({ where: { token } });
  },
};
