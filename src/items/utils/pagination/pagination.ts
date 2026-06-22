/**
 * @file Pagination input parsing and response helpers.
 *
 * Parses raw query-string pagination values and produces
 * validated `page`, `limit`, and `skip` values.
 */

/** Raw pagination input from query parameters (page and limit can be strings or numbers). */
export type PaginationInput = {
  page?: string | number;
  limit?: string | number;
};

/** Parsed and validated pagination result. */
export type Pagination = {
  /** Current page number (minimum 1). */
  page: number;
  /** Records per page (clamped between 1 and 100). */
  limit: number;
  /** Number of records to skip for database offset. */
  skip: number;
};

/**
 * Parses raw pagination input and returns validated pagination values.
 *
 * - Defaults `page` to 1 and `limit` to 20.
 * - Clamps `limit` to a maximum of 100.
 * - Calculates `skip` for database offset queries.
 *
 * @param input - Raw pagination values (e.g. from `req.query`).
 * @returns A validated `Pagination` object.
 *
 * @example
 * ```ts
 * parsePagination({ page: 2, limit: 10 })
 * // { page: 2, limit: 10, skip: 10 }
 * ```
 */
export function parsePagination(input: PaginationInput): Pagination {
  const page = Math.max(Number(input.page) || 1, 1);
  const limit = Math.min(Math.max(Number(input.limit) || 20, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}
