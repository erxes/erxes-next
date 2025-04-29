export const GQL_PAGE_INFO = `
  totalCount
  pageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

export const GQL_CURSOR_PARAM_DEFS = `
  $direction: CURSOR_DIRECTION
  $cursor: String
  $limit: Int
`;

export const GQL_CURSOR_PARAMS = `
  direction: $direction
  cursor: $cursor
  limit: $limit
`;
