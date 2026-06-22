/**
 * @file Stub — re-exports HTTP client types from the registry item source.
 * This file exists so `@shared/types/api` resolves in-editor during development.
 * Consumers get the real file when they `shared-packages add http-client`.
 */

export type {
  MetaT,
  ApiResponse,
  HttpMethod,
  HeadersMap,
  InternalResponse,
} from '../../items/utils/http-client/types';
