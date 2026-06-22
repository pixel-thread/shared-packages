import { PaginationMeta } from "./pagination-meta";

export interface ApiResponse<T> {
  /** Whether the request was processed successfully. */
  success: boolean;
  /** Human-readable status message from the server. */
  message: string;
  /** Response payload — `null` on failure. */
  data: T | null;
  /** Pagination metadata for list endpoints. */
  meta?: PaginationMeta;
  /** Authentication token (returned on login/refresh). */
  token?: string;
  /** Structured error details returned on failure. */
  error?: string | Record<string, unknown>;
}
