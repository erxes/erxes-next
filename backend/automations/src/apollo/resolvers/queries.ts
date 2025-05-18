// import { getService, getPlugins } from '@erxes/api-utils/src/serviceDiscovery';
import {
  cursorPaginate,
  getPlugin,
  getPlugins,
  paginate,
} from 'erxes-api-shared/utils';
import { STATUSES, UI_ACTIONS } from '~/constants';

import { IContext } from '~/db/connectionResolvers';
import { IAutomationDocument, ITrigger } from '~/db/definitions/automations';

interface IListArgs {
  status: string;
  searchValue: string;
  ids?: string;
  page?: number;
  perPage?: number;
  sortField: string;
  sortDirection: number;
  tagIds: string[];
  triggerTypes: string[];
}

interface IHistoriesParams {
  automationId: string;
  page?: number;
  perPage?: number;
  status?: string;
  triggerId?: string;
  triggerType?: string;
  beginDate?: Date;
  endDate?: Date;
}

const generateFilter = (params: IListArgs) => {
  const { status, searchValue, tagIds, triggerTypes, ids } = params;

  const filter: any = { status: { $nin: [STATUSES.ARCHIVED, 'template'] } };

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

const automationQueries = {
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
        params,
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
   * Automations note list
   */
  async automationNotes(
    _root,
    params: { automationId: string },
    { models }: IContext,
  ) {
    return models.Notes.find({ automationId: params.automationId }).sort({
      createdAt: -1,
    });
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

    return await paginate(
      models.Executions.find(filter).sort({ createdAt: -1 }),
      {
        page,
        perPage,
      },
    );
  },

  async automationHistoriesTotalCount(
    _root,
    params: IHistoriesParams,
    { models }: IContext,
  ) {
    const filter: any = generateHistoriesFilter(params);

    return await models.Executions.find(filter).countDocuments();
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
      triggersConst: ITrigger[];
      triggerTypesConst: string[];
      actionsConst: any[];
      propertyTypesConst: Array<{ value: string; label: string }>;
    } = {
      triggersConst: [],
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
          constants.triggersConst.push(trigger);
          constants.triggerTypesConst.push(trigger.type);
          constants.propertyTypesConst.push({
            value: trigger.type,
            label: trigger.label,
          });
        }

        for (const action of actions) {
          constants.actionsConst.push(action);
        }

        if (!!pluginConstants?.emailRecipientTypes?.length) {
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
};

// requireLogin(automationQueries, 'automationsMain');
// requireLogin(automationQueries, 'automationNotes');
// requireLogin(automationQueries, 'automationDetail');

// checkPermission(automationQueries, 'automations', 'showAutomations', []);
// checkPermission(automationQueries, 'automationsMain', 'showAutomations', {
//   list: [],
//   totalCount: 0
// });

export default automationQueries;
