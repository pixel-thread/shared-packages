import type { NextFunction, Request, Response } from 'express';
import { AppError } from '@items/errors/http-errors/base';
import { normalizeUnknownError } from '@items/errors/normalize-error/normalize-error';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const reqAny = req as unknown as Record<string, unknown>;
  const traceId = (reqAny.traceId as string) || 'unknown';
  const appError = normalizeUnknownError(err);

  if (!(err instanceof AppError)) {
    const user = reqAny.user as { associationId?: string; id?: string } | undefined;
    console.error(
      { traceId, error: err, associationId: user?.associationId, userId: user?.id },
      'Unhandled error',
    );
  }

  const status = appError.statusCode || 500;
  const message = appError.message || 'Internal Server Error';

  return res.status(status).json({
    success: false,
    message,
    error: appError.details || undefined,
    traceId,
    timestamp: new Date().toISOString(),
  });
}
