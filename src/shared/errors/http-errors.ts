/**
 * @file Stub — re-exports HTTP error classes from the registry item source.
 * This file exists so `@shared/errors/http-errors` resolves in-editor.
 * Consumers get the real file when they `shared-packages add http-errors`.
 */

export {
  AppError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  PaymentError,
  TooManyRequestsError,
  ValidationError,
  InvalidJsonError,
  WebhookSignatureError,
} from '../../items/errors/http-errors/http-errors';
