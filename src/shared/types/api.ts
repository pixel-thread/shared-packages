export type MetaT = Record<string, unknown>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | Record<string, unknown>;
  meta?: MetaT;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HeadersMap = Record<string, string>;

export interface InternalResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: HeadersMap;
}

export interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}
