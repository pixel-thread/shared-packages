import { asyncHandler } from '@items/utils/async-handler';
import { Router } from 'express';

const router = Router();

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    const { refresh } = await import('../services/auth');
    const result = await refresh(token);
    res.json(result);
  }),
);

export default router;
