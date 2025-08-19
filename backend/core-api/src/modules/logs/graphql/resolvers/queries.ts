import {
  ICursorPaginateParams,
  ICursorPaginateResult,
  ILogDocument,
} from 'erxes-api-shared/core-types';
import {
  computeOperator,
  encodeCursor,
  getCursor,
  getPaginationInfo,
} from 'erxes-api-shared/utils';
import mongoose, { Document, Model, SortOrder, Types } from 'mongoose';
import { IContext } from '~/connectionResolvers';
const operatorMap = {
  ne: '$ne',
  eq: '$eq',
  exists: '$exists',
  lt: '$lt',
  lte: '$lte',
  gt: '$gt',
  gte: '$gte',
  contain: '$regex',
  startsWith: '$regex',
  endsWith: '$regex',
};

const generateOperator = (operator) => operatorMap[operator] || '$eq';

const generateValue = (field, value, operator) => {
  if (field === 'createdAt') {
    return new Date(value);
  }
  if (operator === 'startsWith') {
    return new RegExp(`^${value}`, 'i');
  }
  if (operator === 'endsWith') {
    return new RegExp(`${value}$`, 'i');
  }
  if (operator === 'contain') {
    return new RegExp(value, 'i');
  }

  if (operator === 'exists') {
    return JSON.parse(value);
  }

  return value;
};

const generateFilters = (params) => {
  let filter: any = {};

  if (Object.keys(params?.filters || {})?.length) {
    for (const [field, { operator, value }] of Object.entries<{
      operator: string;
      value: string;
    }>(params?.filters)) {
      filter[field] = {
        [generateOperator(operator)]: generateValue(field, value, operator),
      };
    }
  }

  return filter;
};

function castValue(value: any, type: 'objectId' | 'date' | 'number') {
  if (type === 'objectId') {
    return new Types.ObjectId(value as string);
  }

  if (type === 'date') {
    return new Date(value);
  }

  if (type === 'number') {
    return Number(value);
  }

  return value;
}

export const cursorPaginate = async <T extends Document>({
  model,
  params,
  query,
}: {
  model: Model<T>;
  params: {
    fieldTypes: { [key: string]: 'objectId' | 'date' | 'number' };
  } & ICursorPaginateParams;
  query: mongoose.FilterQuery<T>;
}): Promise<ICursorPaginateResult<T>> => {
  const {
    limit = 20,
    direction = 'forward',
    orderBy = {},
    cursorMode = 'exclusive',
    fieldTypes,
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
        if (!cursor[prevField]) {
          continue;
        }
        andCondition[prevField] = castValue(
          cursor[prevField],
          fieldTypes[prevField],
        );
      }

      const fieldOperator = computeOperator(
        orderBy[field] === 1,
        direction === 'forward',
        cursorMode,
      );

      if (!cursor[field]) {
        continue;
      }

      andCondition[field] = {
        [fieldOperator]: castValue(cursor[field], fieldTypes[field]),
      };

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

export const logQueries = {
  async logsMainList(_root, args, { models }: IContext) {
    const filter = generateFilters(args);

    const { list, totalCount, pageInfo } = await cursorPaginate<ILogDocument>({
      model: models.Logs,
      params: {
        ...args,
        orderBy: { createdAt: -1 },
        fieldTypes: {
          _id: 'objectId',
          createdAt: 'date',
        },
      },
      query: filter,
    });

    return {
      list,
      totalCount,
      pageInfo,
    };
  },

  async logDetail(_root, { _id }, { models }: IContext) {
    return await models.Logs.findOne({ _id });
  },
};
