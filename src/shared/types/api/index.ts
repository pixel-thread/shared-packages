export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    total: number;
    page: number;
    hasNextPage: boolean;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
  };
  token?: string;
  error?: string | Record<string, unknown>;
}
