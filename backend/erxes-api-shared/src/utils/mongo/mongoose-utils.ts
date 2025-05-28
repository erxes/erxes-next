import { ICursorPaginateParams, ICursorPaginateResult } from '@/core-types';
import mongoose, { Document, Model, Schema, SortOrder } from 'mongoose';
import { nanoid } from 'nanoid';
import {
  computeOperator,
  encodeCursor,
  getCursor,
  getPaginationInfo,
} from './cursor-util';
import { mongooseStringRandomId } from './mongoose-types';

export interface IOrderInput {
  _id: string;
  order: number;
}

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

export const updateMongoDocumentOrder = async (
  collection: any,
  orders: IOrderInput[],
) => {
  if (orders.length === 0) {
    return [];
  }

  const ids: string[] = [];
  const bulkOps: Array<{
    updateOne: {
      filter: { _id: string };
      update: { order: number };
    };
  }> = [];

  for (const { _id, order } of orders) {
    ids.push(_id);

    const selector: { order: number } = { order };

    bulkOps.push({
      updateOne: {
        filter: { _id },
        update: selector,
      },
    });
  }

  await collection.bulkWrite(bulkOps);

  return collection.find({ _id: { $in: ids } }).sort({ order: 1 });
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

export const checkCollectionCodeDuplication = async (
  collection: any,
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

export const cursorPaginate = async <T extends Document>({
  model,
  params,
  query,
}: {
  model: Model<T>;
  params: ICursorPaginateParams;
  query: mongoose.FilterQuery<T>;
}): Promise<ICursorPaginateResult<T>> => {
  const {
    limit = 20,
    direction = 'forward',
    orderBy = {},
    cursorMode = 'exclusive',
  } = params;

  if (limit < 1) {
    throw new Error('Limit must be greater than 0');
  }

  if (!('_id' in orderBy)) {
    orderBy['_id'] = 1;
  }

  const baseQuery: mongoose.FilterQuery<T> = { ...query };

  const baseSort: Record<string, SortOrder> = { ...orderBy };

  if (direction === 'backward') {
    for (const key in baseSort) {
      baseSort[key] = baseSort[key] === 1 ? -1 : 1;
    }
  }

  const cursor = getCursor(params);

  if (cursor) {
    const conditions: Record<string, any> = {};

    const sortKeys = Object.keys(baseSort);

    const orConditions: Record<string, any>[] = [];

    for (let i = 0; i < sortKeys.length; i++) {
      const field = sortKeys[i];

      const andCondition: Record<string, any> = {};

      for (let j = 0; j < i; j++) {
        const prevField = sortKeys[j];
        andCondition[prevField] = cursor[prevField];
      }

      const fieldOperator = computeOperator(
        orderBy[field] === 1,
        direction === 'forward',
        cursorMode,
      );

      andCondition[field] = { [fieldOperator]: cursor[field] };

      orConditions.push(andCondition);
    }

    conditions['$or'] = orConditions;

    Object.assign(baseQuery, conditions);
  }

  const _limit = Math.min(Number(limit), 50);

  try {
    const [documents, totalCount] = await Promise.all([
      model
        .find(baseQuery)
        .sort(baseSort)
        .limit(_limit + 1)
        .lean<T[]>(),
      model.countDocuments(query),
    ]);

    const hasMore = documents.length > _limit;

    if (hasMore) {
      documents.pop();
    }

    if (direction === 'backward') {
      documents.reverse();
    }

    if (documents.length === 0) {
      return {
        list: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: Boolean(cursor),
          startCursor: null,
          endCursor: null,
        },
        totalCount,
      };
    }

    const startCursor = encodeCursor<T>(documents[0], orderBy);
    const endCursor = encodeCursor<T>(documents[documents.length - 1], orderBy);

    const { hasNextPage, hasPreviousPage } = getPaginationInfo(
      direction,
      Boolean(cursor),
      hasMore,
    );

    const pageInfo = {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    };

    return {
      // Currently adds cursor directly to data items;
      // Can be replaced with a proper Relay-style `edges`/`node` structure.
      list: documents.map((document) => ({
        ...document,
        cursor: encodeCursor(document, orderBy),
      })),
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

export const schemaWrapper = (
  schema: Schema,
  options?: { contentType?: string },
) => {
  schema.add({ _id: mongooseStringRandomId });
  schema.add({ processId: { type: String, optional: true } });
  // schema.add({ createdAt: { type: Date, default: new Date() } });

  if (options?.contentType) {
    (schema.statics as any)._contentType = options.contentType;
  }

  return schema;
};
