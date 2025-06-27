export interface ICursorListResponse<T> {
  [key: string]: {
    list: T[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}
