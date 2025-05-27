import { ICursorPaginateParams } from '@/core-types';
import { SortOrder } from 'mongoose';

export interface CursorData {
  [key: string]: any;
}

export interface ObjectRecord {
  _id: string;
  [key: string]: any;
  createdAt: string;
  updatedAt: string;
}

export const computeOperator = (
  isAscending: boolean,
  isForwardPagination: boolean,
): string => {
  return isAscending
    ? isForwardPagination
      ? '$gte'
      : '$lte'
    : isForwardPagination
    ? '$lte'
    : '$gte';
};

export const decodeCursor = (cursor: string): CursorData => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString());
  } catch (err) {
    throw new Error(`Invalid cursor: ${cursor}`);
  }
};

export const encodeCursor = <T extends ObjectRecord = ObjectRecord>(
  objectRecord: T,
  order: Record<string, SortOrder> | undefined,
): string => {
  const orderByValues: Record<string, any> = {};

  const orderByKeys = Object.keys(order ?? {});

  for (const key of orderByKeys) {
    orderByValues[key] = objectRecord[key];
  }

  const cursorData: CursorData = {
    ...orderByValues,
    _id: objectRecord._id,
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
): {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} => {
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
