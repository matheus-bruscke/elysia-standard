declare type PaginationParams<T> = {
  page?: number;
  order?: "asc" | "desc";
  orderBy?: keyof T;
  search?: string;
  limit?: number;
};

declare type PaginationResponse<T> = {
  items: T[];
  total: number;
  page: number;
};
