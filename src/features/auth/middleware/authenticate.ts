import { UnauthorizedError } from '@items/errors/http-errors/http-errors';
import { asyncHandler } from '@items/utils/async-handler';
import { verifyAccessToken } from '../utils/tokens';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = header.slice(7);
  const payload = await verifyAccessToken(token);

  req.user = {
    id: payload.sub,
    roles: payload.roles,
    associationId: '',
    associationSlug: '',
    associationName: '',
    memberTypeId: null,
  };

  next();
});
