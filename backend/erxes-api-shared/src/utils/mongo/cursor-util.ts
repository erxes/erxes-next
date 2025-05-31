import { ICursorPaginateParams } from '@/core-types';
import { SortOrder } from 'mongoose';

export interface CursorData {
  [key: string]: any;
}

export type PaginationInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const computeOperator = (
  isAscending: boolean,
  isForwardPagination: boolean,
  cursorMode: 'inclusive' | 'exclusive',
): string => {
  const operatorMap: Record<'inclusive' | 'exclusive', string[][]> = {
    inclusive: [
      ['$gte', '$lte'], // isAscending = true
      ['$lte', '$gte'], // isAscending = false
    ],
    exclusive: [
      ['$gt', '$lt'], // isAscending = true
      ['$lt', '$gt'], // isAscending = false
    ],
  };

  return operatorMap[cursorMode][isAscending ? 0 : 1][
    isForwardPagination ? 0 : 1
  ];
};

export const decodeCursor = (cursor: string): CursorData => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString());
  } catch {
    throw new Error(`Invalid cursor: ${cursor}`);
  }
};

export const encodeCursor = <T extends { [key: string]: any }>(
  document: T,
  order: Record<string, SortOrder> | undefined,
): string => {
  const orderByValues: Record<string, any> = {};

  const orderByKeys: string[] = Object.keys(order ?? {});

  for (const key of orderByKeys) {
    orderByValues[key] = document[key];
  }

  const cursorData: CursorData = {
    ...orderByValues,
    _id: document._id,
  };

  return Buffer.from(JSON.stringify(cursorData)).toString('base64');
};

export const getCursor = (
  params: ICursorPaginateParams,
): Record<string, any> | undefined => {
  if (params.cursor) return decodeCursor(params.cursor);

  return undefined;
};

export const getPaginationInfo = (
  direction: 'forward' | 'backward',
  hasCursor: boolean,
  hasMore: boolean,
): PaginationInfo => {
  if (direction === 'backward') {
    return {
      hasNextPage: hasCursor,
      hasPreviousPage: hasMore,
    };
  }

  return {
    hasNextPage: hasMore,
    hasPreviousPage: hasCursor,
  };
};
