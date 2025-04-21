import { ICursorPaginateParams } from '@/core-types';
import mongoose, { Document, Model, SortOrder } from 'mongoose';
import { nanoid } from 'nanoid';

export const mongooseField = (options: any) => {
  const { pkey, type, optional } = options;

  if (type === String && !pkey && !optional) {
    options.validate = /\S+/;
  }

  if (pkey) {
    options.type = String;
    options.default = () => nanoid();
  }

  return options;
};

export const defaultPaginate = (
  collection: mongoose.Query<any, any>,
  params: {
    ids?: string[];
    page?: number;
    perPage?: number;
    excludeIds?: boolean;
  },
) => {
  const { page = 1, perPage = 20, ids, excludeIds } = params || { ids: null };

  const _page = Number(page || '1');
  const _limit = Number(perPage || '20');

  if (ids && ids.length > 0) {
    return excludeIds ? collection.limit(_limit) : collection;
  }

  return collection.limit(_limit).skip((_page - 1) * _limit);
};

export const checkCodeDuplication = async (
  collection: mongoose.Model<any>,
  code: string,
) => {
  if (code.includes('/')) {
    throw new Error('The "/" character is not allowed in the code');
  }

  const category = await collection.findOne({
    code,
  });

  if (category) {
    throw new Error('Code must be unique');
  }
};

interface CursorPaginateResult<T> {
  list: T[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
  totalCount: number;
}

interface CursorPaginateParams {
  limit?: number;
  cursor?: string | null;
  direction?: 'forward' | 'backward';
  sortField?: string;
}

const PAGINATE_DIRECTION_MAP = {
  forward: {
    operator: '$gt',
    order: 1,
  },
  backward: {
    operator: '$lt',
    order: -1,
  },
} as const;

export const cursorPaginate = async <T extends Document>({
  model,
  params,
  query,
}: {
  model: Model<T>;
  params: CursorPaginateParams;
  query: mongoose.FilterQuery<T>;
}): Promise<CursorPaginateResult<T>> => {
  const {
    limit = 20,
    cursor = null,
    direction = 'forward',
    sortField = '_id',
  } = params;

  if (limit < 1) {
    throw new Error('Limit must be greater than 0');
  }

  const { operator, order } = PAGINATE_DIRECTION_MAP[direction];
  const baseQuery: mongoose.FilterQuery<T> = { ...query };

  if (cursor) {
    baseQuery._id = { [operator]: cursor } as any;
  }

  const _limit = Number(limit);

  try {
    const [documents, totalCount] = await Promise.all([
      model
        .find(baseQuery)
        .sort({ [sortField]: order as SortOrder })
        .limit(_limit + 1)
        .lean<T[]>(),
      model.countDocuments(query),
    ]);

    const hasNextPage = documents.length > limit;
    const trimmedDocuments = hasNextPage ? documents.slice(0, -1) : documents;
    const finalDocuments =
      direction === 'backward' ? trimmedDocuments.reverse() : trimmedDocuments;

    const pageInfo = {
      hasNextPage,
      hasPreviousPage: Boolean(cursor),
      startCursor: finalDocuments[0]?._id?.toString() || null,
      endCursor:
        finalDocuments[finalDocuments.length - 1]?._id?.toString() || null,
    };

    return {
      list: finalDocuments,
      pageInfo,
      totalCount,
    };
  } catch (error) {
    throw new Error(
      `Cursor pagination failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};
