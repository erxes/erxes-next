import mongoose, { Document, Model, Schema, SortOrder } from 'mongoose';
import { nanoid } from 'nanoid';
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

interface CursorPaginateResult<T> {
  list: T[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | undefined;
    endCursor: string | undefined;
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
    reverseOrder: -1,
  },
  backward: {
    operator: '$lt',
    order: -1,
    reverseOrder: 1,
  },
} as const;

export const getPaginationInfo = (
  direction: 'forward' | 'backward',
  hasCursor: boolean,
  hasMore: boolean,
) => {
  const hasNextPage = direction === 'backward' ? true : hasMore;

  let hasPreviousPage = false;

  if (hasCursor) {
    if (direction === 'backward') {
      hasPreviousPage = hasMore;
    } else {
      hasPreviousPage = true;
    }
  }

  return {
    hasNextPage,
    hasPreviousPage,
  };
};

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
    baseQuery._id = { [operator]: cursor };
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

    const hasMore = documents.length > limit;

    if (hasMore) {
      documents.pop();
    }

    if (direction === 'backward') {
      documents.reverse();
    }

    if (documents.length === 0 && cursor) {
      const { reverseOrder } = PAGINATE_DIRECTION_MAP[direction];

      const edgeDoc = await model
        .findOne(query)
        .sort({ [sortField]: reverseOrder as SortOrder })
        .select({ [sortField]: 1 })
        .lean();

      if (
        edgeDoc &&
        edgeDoc[sortField as keyof T]?.toString() === cursor.toString()
      ) {
        const edgeDocs = await model
          .find(query)
          .sort({ [sortField]: reverseOrder as SortOrder })
          .limit(limit)
          .lean<T[]>();

        if (direction === 'forward') {
          edgeDocs.reverse();
        }

        const { hasNextPage, hasPreviousPage } = getPaginationInfo(
          direction,
          Boolean(cursor),
          false,
        );

        return {
          list: edgeDocs,
          pageInfo: {
            hasNextPage,
            hasPreviousPage,
            startCursor: edgeDocs[0]?._id?.toString(),
            endCursor: edgeDocs[edgeDocs.length - 1]?._id?.toString(),
          },
          totalCount,
        };
      }
    }

    const { hasNextPage, hasPreviousPage } = getPaginationInfo(
      direction,
      Boolean(cursor),
      hasMore,
    );

    const pageInfo = {
      hasNextPage,
      hasPreviousPage,
      startCursor: documents[0]?._id?.toString(),
      endCursor: documents[documents.length - 1]?._id?.toString(),
    };

    return {
      list: documents,
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
