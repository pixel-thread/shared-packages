import { asyncHandler } from '@items/utils/async-handler';
import { validate } from '@items/middleware/express-validate/express-validate';
import { prisma } from '@items/prisma/client';
import { Router } from 'express';
import * as crypto from 'crypto';
import { forgotPasswordSchema, resetPasswordSchema } from '../validators/auth';

const router = Router();

router.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.json({ message: 'If the email exists, a reset link has been sent' });
      return;
    }

    const token = crypto.randomUUID();
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    res.json({ message: 'If the email exists, a reset link has been sent' });
  }),
);

router.post(
  '/reset-password',
  validate({ body: resetPasswordSchema }),
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const record = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    const { hashPassword } = await import('../lib/password');
    const passwordHash = hashPassword(password);

    await prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    });

    await prisma.passwordReset.delete({ where: { id: record.id } });

    res.json({ message: 'Password reset successfully' });
  }),
);

export default router;
