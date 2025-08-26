import { SortOrder, FilterQuery, Model } from 'mongoose';

export interface CursorPaginateParams<T> {
  model: Model<T>;
  limit?: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
  sortBy?: Record<string, SortOrder>;
  filter?: FilterQuery<T>;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface CursorResult<T> {
  list: T[];
  totalCount: number;
  pageInfo: PageInfo;
}

export const encodeCursor = (item: any, sortFields: string[]): string => {
  const cursorData: any = {};

  for (const field of sortFields) {
    if (item[field] !== undefined) {
      cursorData[field] = item[field];
    }
  }

  cursorData._id = item._id;

  return Buffer.from(JSON.stringify(cursorData)).toString('base64');
};

export const decodeCursor = (cursor: string): any => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString());
  } catch {
    throw new Error('Invalid cursor format');
  }
};

export const buildCursorQuery = (
  cursor: string,
  sortBy: Record<string, SortOrder>,
  direction: 'forward' | 'backward',
): Record<string, any> => {
  const cursorData = decodeCursor(cursor);
  const sortFields = Object.keys(sortBy);

  if (sortFields.length === 0) {
    const operator = direction === 'forward' ? '$gt' : '$lt';
    return { _id: { [operator]: cursorData._id } };
  }

  const orConditions: Record<string, any>[] = [];

  for (let i = 0; i < sortFields.length; i++) {
    const field = sortFields[i];
    const sortOrder = sortBy[field];
    const isAscending = sortOrder === 1 || sortOrder === 'asc';

    const condition: Record<string, any> = {};

    for (let j = 0; j < i; j++) {
      const prevField = sortFields[j];
      condition[prevField] = cursorData[prevField];
    }

    const operator =
      direction === 'forward'
        ? isAscending
          ? '$gt'
          : '$lt'
        : isAscending
        ? '$lt'
        : '$gt';

    if (cursorData[field] !== undefined) {
      condition[field] = { [operator]: cursorData[field] };
      orConditions.push(condition);
    }
  }

  const finalCondition: Record<string, any> = {};
  for (const field of sortFields) {
    if (cursorData[field] !== undefined) {
      finalCondition[field] = cursorData[field];
    }
  }

  const idOperator = direction === 'forward' ? '$gt' : '$lt';
  finalCondition._id = { [idOperator]: cursorData._id };
  orConditions.push(finalCondition);

  return orConditions.length > 0 ? { $or: orConditions } : {};
};
