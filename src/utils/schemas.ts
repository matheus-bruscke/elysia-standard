import * as t from "@sinclair/typebox";

enum ORDER {
  "ASC" = "asc",
  "DESC" = "desc",
}

const searchSchema = t.Object({
  page: t.Optional(t.Number()),
  order: t.Optional(t.Enum(ORDER)),
  orderBy: t.Optional(t.String()),
  search: t.Optional(t.String()),
  limit: t.Optional(t.Number()),
});

type SearchSchema = t.Static<typeof searchSchema>;

function toSearchParams<T>(query: SearchSchema): PaginationParams<T> {
  return {
    page: query.page,
    limit: query.limit,
    order: query.order,
    orderBy: query.orderBy as keyof T,
    search: query.search,
  };
}

export { searchSchema, toSearchParams };
