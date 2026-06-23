import { asyncHandler } from '@items/utils/async-handler';
import { prisma } from '@items/prisma/client';
import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id ?? '' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  }),
);

export default router;
