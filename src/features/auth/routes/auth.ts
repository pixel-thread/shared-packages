import { asyncHandler } from '@items/utils/async-handler';
import { validate } from '@items/middleware/express-validate/express-validate';
import { Router } from 'express';
import { loginSchema, registerSchema } from '../validators/auth';
import * as authService from '../services/auth';

const router = Router();

router.post(
  '/register',
  validate({ body: registerSchema }),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }),
);

router.post(
  '/login',
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.json(result);
  }),
);

export default router;
