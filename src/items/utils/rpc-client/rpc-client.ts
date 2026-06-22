import { METHODS } from '@utils/constants';
import { ApiResponse } from '@sharedTypes/api';
import { http } from './http';

export type RpcRequest<TParams = unknown> = {
  method: METHODS;
  params?: TParams;
};

export const rpc = async <TResult, TParams = unknown>(
  method: string,
  params?: TParams
): Promise<ApiResponse<TResult>> => {
  return http.post<TResult>('/rpc', {
    method,
    params,
  });
};
