import { Document, Model, SortOrder } from 'mongoose';
import { ICursorPaginateParams } from '../../core-types';

export interface CursorData {
  [key: string]: any;
}

export type PaginationInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const computeOperator = (
  isAscending: boolean,
  direction: 'forward' | 'backward',
  cursorMode: 'inclusive' | 'exclusive',
): string => {
  const isForwardPagination = direction === 'forward';

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
): CursorData | undefined => {
  if (params.cursor) return decodeCursor(params.cursor);

  return undefined;
};

export const getPaginationInfo = (
  direction: 'forward' | 'backward',
  hasCursor: boolean,
  hasMore: boolean,
  isEdgeCase: boolean,
): PaginationInfo => {
  if (direction === 'backward') {
    return {
      hasNextPage: hasCursor,
      hasPreviousPage: hasMore,
    };
  }

  return {
    hasNextPage: hasMore,
    hasPreviousPage: isEdgeCase ? isEdgeCase && hasCursor : isEdgeCase,
  };
};

export const computeCursorFilter = (
  cursor: CursorData,
  orderBy: Record<string, SortOrder>,
  direction: 'forward' | 'backward',
  cursorMode: 'inclusive' | 'exclusive',
): Record<string, any>[] => {
  const conditions: Record<string, any>[] = [];

  const sortKeys = Object.keys(orderBy);

  for (let i = 0; i < sortKeys.length; i++) {
    const field = sortKeys[i];

    const andCondition: Record<string, any> = {};

    for (let j = 0; j < i; j++) {
      const prevField = sortKeys[j];

      andCondition[prevField] = cursor[prevField];
    }

    const fieldOperator = computeOperator(
      orderBy[field] === 1,
      direction,
      cursorMode,
    );

    andCondition[field] = { [fieldOperator]: cursor[field] };

    conditions.push(andCondition);
  }

  return conditions;
};

export const computeEdgeCase = async <T extends Document>(
  model: Model<T>,
  query: Record<string, any>,
  cursor: CursorData | undefined,
  orderBy: Record<string, SortOrder>,
): Promise<boolean> => {
  if (!cursor) {
    return false;
  }

  const conditions = computeCursorFilter(
    cursor,
    orderBy,
    'backward', // to find documents before the cursor
    'exclusive', // excludes the cursor itself
  );

  return !!(await model.exists({ ...query, $or: conditions }));
};

export const getCursorInfo = <T extends { [key: string]: any }>(
  documents: T[],
  orderBy: Record<string, SortOrder>,
  direction: 'forward' | 'backward',
  cursorMode: 'inclusive' | 'exclusive',
  hasMore: boolean,
) => {
  let startDoc: T | undefined;
  let endDoc: T | undefined;

  switch (cursorMode) {
    case 'inclusive': {
      if (direction === 'forward') {
        startDoc = documents[0];
        endDoc = documents[documents.length - 1];

        if (hasMore) {
          documents.pop();
        }
      }

      if (direction === 'backward') {
        documents.reverse();

        startDoc = documents[0];
        endDoc = documents[documents.length - 1];

        documents.pop();
      }

      break;
    }

    case 'exclusive': {
      if (direction === 'forward') {
        if (hasMore) {
          documents.pop();
        }

        startDoc = documents[0];
        endDoc = documents[documents.length - 1];
      }

      if (direction === 'backward') {
        if (hasMore) {
          documents.pop();
        }

        documents.reverse();

        startDoc = documents[0];
        endDoc = documents[documents.length - 1];
      }

      break;
    }

    default:
      break;
  }

  if (!startDoc || !endDoc) {
    return {
      startCursor: null,
      endCursor: null,
    };
  }

  return {
    startCursor: encodeCursor(startDoc, orderBy),
    endCursor: encodeCursor(endDoc, orderBy),
  };
};
