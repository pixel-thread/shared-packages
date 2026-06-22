export type PaginationInput = {
  page?: string | number;
  limit?: string | number;
};

export type Pagination = {
  page: number;
  limit: number;
  skip: number;
};

export function parsePagination(input: PaginationInput): Pagination {
  const page = Math.max(Number(input.page) || 1, 1);
  const limit = Math.min(Math.max(Number(input.limit) || 20, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}
