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

export const paginateMongooseCollection = (
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

const PAGINATE_DIRECTION_MAP = {
  forward: {
    operator: '$gt',
    order: 1,
  },
  backward: {
    operator: '$lt',
    order: -1,
  },
};

export const paginate = async <T extends Document>({
  model,
  params,
  query,
}: {
  model: Model<T>;
  params: ICursorPaginateParams;
  query: any;
}) => {
  const {
    limit = 2,
    cursor = null,
    direction = 'forward',
    sortField = '_id',
  } = params || {};

  const { operator, order } = PAGINATE_DIRECTION_MAP[direction];

  const baseQuery = { ...query };

  if (cursor) {
    baseQuery._id = { [operator]: cursor };
  }

  const _limit = Number(limit);

  let documents = await model
    .find(baseQuery)
    .sort({ [sortField]: order as SortOrder })
    .limit(_limit + 1)
    .lean();

  const totalCount = await model.countDocuments(query);

  const hasNextPage = documents.length > limit;

  if (hasNextPage) {
    documents.pop();
  }

  if (direction === 'backward') {
    documents = documents.reverse();
  }

  const pageInfo = {
    hasNextPage,
    hasPreviousPage: Boolean(cursor),
    startCursor: documents[0]?._id || null,
    endCursor: documents[documents.length - 1]?._id || null,
  };

  return {
    list: documents,
    pageInfo,
    totalCount,
  };
};
