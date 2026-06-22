/**
 * @file RPC client for JSON-RPC-style endpoints.
 *
 * Sends method calls to a `/rpc` endpoint via `HTTP POST` using the
 * existing HTTP client wrapper. Useful for consolidating multiple
 * related operations behind a single endpoint.
 */

import { METHODS } from '@utils/constants';
import type { ApiResponse } from '@items/utils/http-client';
import { http } from '@items/utils/http-client/http';

/** A generic RPC request payload. */
export type RpcRequest<TParams = unknown> = {
  /** The RPC method name to invoke. */
  method: METHODS;
  /** Optional parameters passed to the method. */
  params?: TParams;
};

/**
 * Sends an RPC request to the server via `POST /rpc`.
 *
 * @typeParam TResult - The expected shape of the response data.
 * @typeParam TParams - The shape of the request parameters.
 * @param method - The RPC method name.
 * @param params - Optional method parameters.
 * @returns A promise resolving to a typed {@link ApiResponse}.
 *
 * @example
 * ```ts
 * const res = await rpc<UserProfile>("getUser", { id: 42 });
 * ```
 */
export const rpc = async <TResult, TParams = unknown>(
  method: string,
  params?: TParams
): Promise<ApiResponse<TResult>> => {
  return http.post<TResult>('/rpc', {
    method,
    params,
  });
};
