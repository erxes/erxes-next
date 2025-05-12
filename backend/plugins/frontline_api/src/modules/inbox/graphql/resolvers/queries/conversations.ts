import { IContext, IModels } from '~/connectionResolvers';
import QueryBuilder, { IListArgs } from '~/conversationQueryBuilder';
import { CONVERSATION_STATUSES } from '@/inbox/db/definitions/constants';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { defaultPaginate } from 'erxes-api-shared/src/utils';
import { IConversationDocument } from '~/modules/inbox/@types/conversations';

// count helper
const count = async (models: IModels, query: any): Promise<number> => {
  const result = await models.Conversations.countDocuments(query);
  return Number(result);
};
export const conversationQueries = {
  /**
   * Conversations list
   */
  async conversations(
    _root,
    params: IListArgs,
    { user, models, subdomain }: IContext,
  ) {
    // filter by ids of conversations
    if (params && params.ids) {
      const { list, totalCount, pageInfo } =
        await cursorPaginate<IConversationDocument>({
          model: models.Conversations,
          params,
          query: { _id: { $in: params.ids } },
        });
      return { list, totalCount, pageInfo };
    }

    const { list, totalCount, pageInfo } =
      await cursorPaginate<IConversationDocument>({
        model: models.Conversations,
        params,
        query: {},
      });
    return { list, totalCount, pageInfo };
  },

  /**
   * Get conversation messages
   */
  async conversationMessages(
    _root,
    {
      conversationId,
      skip,
      limit,
      getFirst,
    }: {
      conversationId: string;
      skip: number;
      limit: number;
      getFirst: boolean;
    },
    { models }: IContext,
  ) {
    //incomplete
    return 'success';
  },

  /**
   *  Get all conversation messages count. We will use it in pager
   */
  async conversationMessagesTotalCount(
    _root,
    { conversationId }: { conversationId: string },
    { models }: IContext,
  ) {
    //incomplete
  },

  /**
   * Group conversation counts by brands, channels, integrations, status
   */
  async conversationCounts(
    _root,
    params: IListArgs,
    { user, models, subdomain }: IContext,
  ) {
    const response: any = {};
    const _user = {
      _id: user._id,
      code: user.code,
      starredConversationIds: user.starredConversationIds,
      role: user.role,
    };

    const qb = new QueryBuilder(models, subdomain, params, _user);

    await qb.buildAllQueries();

    const queries = qb.queries;

    const mainQuery = {
      ...qb.mainQuery(),
      ...queries.integrations,
      ...queries.extended,
    };

    // unassigned count
    response.unassigned = await count(models, {
      ...mainQuery,
      ...qb.unassignedFilter(),
    });

    // participating count
    response.participating = await count(models, {
      ...mainQuery,
      ...qb.participatingFilter(),
    });

    // starred count
    response.starred = await count(models, {
      ...mainQuery,
      ...qb.starredFilter(),
    });

    // resolved count
    response.resolved = await count(models, {
      ...mainQuery,
      ...qb.statusFilter(['closed']),
    });

    // awaiting response count
    response.awaitingResponse = await count(models, {
      ...mainQuery,
      ...qb.awaitingResponse(),
    });

    return response;
  },

  /**
   * Get one conversation
   */
  async conversationDetail(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Conversations.findOne({ _id });
  },

  /**
   * Get all conversations count. We will use it in pager
   */
  async conversationsTotalCount(
    _root,
    params: IListArgs,
    { user, models, subdomain }: IContext,
  ) {
    // initiate query builder
    const qb = new QueryBuilder(models, subdomain, params, {
      _id: user._id,
      code: user.code,
      starredConversationIds: user.starredConversationIds,
    });

    await qb.buildAllQueries();

    return models.Conversations.find(qb.mainQuery()).countDocuments();
  },

  /**
   * Get last conversation
   */
  async conversationsGetLast(
    _root,
    params: IListArgs,
    { user, models, subdomain }: IContext,
  ) {
    // initiate query builder
    const qb = new QueryBuilder(models, subdomain, params, {
      _id: user._id,
      code: user.code,
      starredConversationIds: user.starredConversationIds,
    });

    await qb.buildAllQueries();

    return models.Conversations.findOne(qb.mainQuery())
      .sort({ updatedAt: -1 })
      .lean();
  },

  /**
   * Get all unread conversations for logged in user
   */
  async conversationsTotalUnreadCount(
    _root,
    _args,
    { user, models, subdomain, serverTiming }: IContext,
  ) {
    serverTiming.startTime('buildQuery');

    // initiate query builder
    const qb = new QueryBuilder(
      models,
      subdomain,
      {},
      { _id: user._id, code: user.code },
    );

    await qb.buildAllQueries();

    serverTiming.endTime('buildQuery');

    serverTiming.startTime('integrationFilter');

    // get all possible integration ids
    const integrationsFilter = await qb.integrationsFilter();

    serverTiming.endTime('integrationFilter');

    serverTiming.startTime('query');

    const response = await models.Conversations.countDocuments({
      ...integrationsFilter,
      status: { $in: [CONVERSATION_STATUSES.NEW, CONVERSATION_STATUSES.OPEN] },
      readUserIds: { $ne: user._id },
      $and: [{ $or: qb.userRelevanceQuery() }],
    });

    serverTiming.endTime('query');

    return response;
  },

  async inboxFields(_root, _args, { subdomain }: IContext) {
    const response: {
      customer?: any[];
      conversation?: any[];
      device?: any[];
    } = {
      customer: [],
      conversation: [],
      device: [],
    };

    return response;
  },

  /**
   * Users conversations list
   */
  async userConversations(
    _root,
    { _id, perPage }: { _id: string; perPage: number },
    { models }: IContext,
  ) {
    const selector = { participatedUserIds: { $in: [_id] } };

    const list = defaultPaginate(models.Conversations.find(selector), {
      perPage,
    });
    const totalCount = models.Conversations.find(selector).countDocuments();

    return { list, totalCount };
  },
};
