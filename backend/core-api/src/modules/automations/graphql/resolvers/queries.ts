import { getPlugin, getPlugins } from 'erxes-api-shared/utils';

import {
  AUTOMATION_STATUSES,
  IAutomationDocument,
  IAutomationExecutionDocument,
  IAutomationsActionConfig,
  IAutomationsTriggerConfig,
} from 'erxes-api-shared/core-modules';
import {
  ICursorPaginateParams,
  ICursorPaginateResult,
} from 'erxes-api-shared/core-types';
import {
  computeOperator,
  encodeCursor,
  getCursor,
  getPaginationInfo,
} from 'erxes-api-shared/utils';
import { Document, FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { UI_ACTIONS, UI_TRIGGERS } from '../../constants';

export interface IListArgs extends ICursorPaginateParams {
  status: string;
  searchValue: string;
  ids?: string;
  page?: number;
  perPage?: number;
  sortField: string;
  sortDirection: number;
  tagIds: string[];
  excludeIds: string[];
  triggerTypes: string[];
}

export interface IHistoriesParams {
  automationId: string;
  page?: number;
  perPage?: number;
  status?: string;
  triggerId?: string;
  triggerType?: string;
  beginDate?: Date;
  endDate?: Date;
}

function castValue(value: any, type?: 'objectId' | 'date' | 'number') {
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
    fieldTypes?: { [key: string]: 'objectId' | 'date' | 'number' };
  } & ICursorPaginateParams;
  query: FilterQuery<T>;
}): Promise<ICursorPaginateResult<T>> => {
  const {
    limit = 20,
    direction = 'forward',
    orderBy = {},
    cursorMode = 'exclusive',
    fieldTypes = {},
  } = params;

  if (limit < 1) {
    throw new Error('Limit must be greater than 0');
  }

  if (!('_id' in orderBy)) {
    orderBy['_id'] = 1;
  }

  const baseQuery: FilterQuery<T> = { ...query };

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

const generateFilter = (params: IListArgs) => {
  const {
    status,
    searchValue,
    tagIds,
    triggerTypes,
    ids,
    excludeIds = [],
  } = params;

  const filter: any = {
    status: { $nin: [AUTOMATION_STATUSES.ARCHIVED, 'template'] },
  };

  if (status) {
    filter.status = status;
  }

  if (searchValue) {
    filter.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  if (tagIds) {
    filter.tagIds = { $in: tagIds };
  }

  if (triggerTypes?.length) {
    filter['triggers.type'] = { $in: triggerTypes };
  }

  if (ids?.length) {
    filter._id = { $in: ids };
  }
  if (excludeIds.length) {
    filter._id = { $nin: excludeIds };
  }

  return filter;
};

const generateHistoriesFilter = (params: any) => {
  const {
    automationId,
    triggerType,
    triggerId,
    status,
    beginDate,
    endDate,
    targetId,
    targetIds,
  } = params;
  const filter: any = { automationId };

  if (status) {
    filter.status = status;
  }

  if (triggerId) {
    filter.triggerId = triggerId;
  }

  if (triggerType) {
    filter.triggerType = triggerType;
  }

  if (beginDate) {
    filter.createdAt = { $gte: beginDate };
  }

  if (endDate) {
    filter.createdAt = { $lte: endDate };
  }

  if (targetId) {
    filter.targetId = targetId;
  }

  if (targetIds?.length) {
    filter.targetId = { $in: targetIds };
  }

  return filter;
};

export const automationQueries = {
  /**
   * Automations list
   */
  async automations(_root, params: IListArgs, { models }: IContext) {
    const filter = generateFilter(params);

    return models.Automations.find(filter).lean();
  },

  /**
   * Automations for only main list
   */
  async automationsMain(_root, params: IListArgs, { models }: IContext) {
    const filter = generateFilter(params);

    const { list, totalCount, pageInfo } =
      await cursorPaginate<IAutomationDocument>({
        model: models.Automations,
        params: {
          ...params,
          orderBy: {
            createdAt: -1,
          },
          fieldTypes: {
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

  /**
   * Get one automation
   */
  async automationDetail(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Automations.getAutomation(_id);
  },

  /**
   * Automations history list
   */
  async automationHistories(
    _root,
    params: IHistoriesParams,
    { models }: IContext,
  ) {
    const { page, perPage } = params;

    const filter: any = generateHistoriesFilter(params);

    const { list, totalCount, pageInfo } =
      await cursorPaginate<IAutomationExecutionDocument>({
        model: models.AutomationExecutions,
        params: {
          ...params,
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
    // return await paginate(
    //   models.Executions.find(filter).sort({ createdAt: -1 }),
    //   {
    //     page,
    //     perPage,
    //   },
    // );
  },

  async automationHistoriesTotalCount(
    _root,
    params: IHistoriesParams,
    { models }: IContext,
  ) {
    const filter: any = generateHistoriesFilter(params);

    return await models.AutomationExecutions.find(filter).countDocuments();
  },

  async automationConfigPrievewCount(
    _root,
    params: { config: any },
    { subdomain }: IContext,
  ) {
    return;
    // const config = params.config;
    // if (!config) {
    //   return;
    // }

    // const contentId = config.contentId;
    // if (!contentId) {
    //   return;
    // }

    // const segment = await sendSegmentsMessage({
    //   subdomain,
    //   action: 'findOne',
    //   data: { _id: contentId },
    //   isRPC: true
    // });

    // if (!segment) {
    //   return;
    // }

    // const result = await sendSegmentsMessage({
    //   subdomain,
    //   action: 'fetchSegment',
    //   data: {
    //     segmentId: segment._id,
    //     options: { returnCount: true }
    //   },
    //   isRPC: true
    // });

    // return result;
  },

  async automationsTotalCount(
    _root,
    { status }: { status: string },
    { models }: IContext,
  ) {
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    return models.Automations.find(filter).countDocuments();
  },

  async automationConstants(_root, {}) {
    const plugins = await getPlugins();

    const constants: {
      triggersConst: IAutomationsTriggerConfig[];
      triggerTypesConst: string[];
      actionsConst: IAutomationsActionConfig[];
      propertyTypesConst: Array<{ value: string; label: string }>;
    } = {
      triggersConst: [...UI_TRIGGERS],
      triggerTypesConst: [],
      actionsConst: [...UI_ACTIONS],
      propertyTypesConst: [],
    };

    for (const pluginName of plugins) {
      const plugin = await getPlugin(pluginName);
      const meta = plugin.config?.meta || {};

      if (meta && meta.automations && meta.automations.constants) {
        const pluginConstants = meta.automations.constants || {};
        const { triggers = [], actions = [] } = pluginConstants;

        for (const trigger of triggers) {
          constants.triggersConst.push({ ...trigger, pluginName });
          constants.triggerTypesConst.push(trigger.type);
          constants.propertyTypesConst.push({
            value: trigger.type,
            label: trigger.label,
          });
        }

        for (const action of actions) {
          constants.actionsConst.push({ ...action, pluginName });
        }

        if (pluginConstants?.emailRecipientTypes?.length) {
          const updatedEmailRecipIentTypes =
            pluginConstants.emailRecipientTypes.map((eRT) => ({
              ...eRT,
              pluginName,
            }));
          constants.actionsConst = constants.actionsConst.map((actionConst) =>
            actionConst.type === 'sendEmail'
              ? {
                  ...actionConst,
                  emailRecipientsConst: actionConst.emailRecipientsConst.concat(
                    updatedEmailRecipIentTypes,
                  ),
                }
              : actionConst,
          );
        }
      }
    }

    return constants;
  },

  async automationBotsConstants() {
    const plugins = await getPlugins();
    const botsConstants: any[] = [];

    for (const pluginName of plugins) {
      const plugin = await getPlugin(pluginName);
      const bots = plugin?.config?.meta?.automations?.constants?.bots || [];

      if (bots.length) {
        botsConstants.push(...bots.map((bot) => ({ ...bot, pluginName })));
      }
    }

    return botsConstants;
  },
};

// requireLogin(automationQueries, 'automationsMain');
// requireLogin(automationQueries, 'automationNotes');
// requireLogin(automationQueries, 'automationDetail');

// checkPermission(automationQueries, 'automations', 'showAutomations', []);
// checkPermission(automationQueries, 'automationsMain', 'showAutomations', {
//   list: [],
//   totalCount: 0
// });
