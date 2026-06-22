/**
 * Standard API Response structure for all requests.
 * Used across http utility.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: MetaT;
  token?: string;
  error?: string | Record<string, unknown>;
}

export type MetaT = {
  total: number;
  page: number;
  hasNextPage: boolean;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type HeadersMap = Record<string, string>;

// Unified internal response shape to handle both fetch and ssl-pinning
export interface InternalResponse {
  status: number;
  body: string;
  headers: HeadersMap;
}
