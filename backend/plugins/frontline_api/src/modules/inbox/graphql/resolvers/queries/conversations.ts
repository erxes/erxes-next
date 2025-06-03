import { IContext, IModels } from '~/connectionResolvers';
import QueryBuilder, { IListArgs } from '~/conversationQueryBuilder';
import { CONVERSATION_STATUSES } from '@/inbox/db/definitions/constants';
import { cursorPaginate } from 'erxes-api-shared/utils';
import {
  IConversationDocument,
  IConversationListParams,
} from '@/inbox/@types/conversations';
import { IMessageDocument } from '@/inbox/@types/conversationMessages';
import { countByConversations } from '@/inbox/conversationUtils';

interface ICountBy {
  [index: string]: number;
}

interface IConversationRes {
  [index: string]: number | ICountBy;
}
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
    _parent: undefined,
    params: IConversationListParams,
    { user, models, subdomain, serverTiming }: IContext,
  ) {
    serverTiming?.startTime('conversations');

    if (params && params.ids) {
      const { list, totalCount, pageInfo } =
        await cursorPaginate<IConversationDocument>({
          model: models.Conversations,
          params: {
            orderBy: { updatedAt: -1 }, // Optional, _id is used as a fallback
          },
          query: { _id: { $in: params.ids } },
        });

      serverTiming?.endTime('conversationsQuery');

      serverTiming?.endTime('conversations');

      return { list, totalCount, pageInfo };
    }

    serverTiming?.startTime('buildQuery');
    const qb = new QueryBuilder(models, subdomain, params, {
      _id: user._id,
      code: user.code,
      starredConversationIds: user.starredConversationIds,
      role: user.role,
    });

    await qb.buildAllQueries();

    serverTiming?.endTime('buildQuery');

    serverTiming?.startTime('conversationsQuery');
    console.log('Conversations query params:', qb.mainQuery());
    const { list, totalCount, pageInfo } =
      await cursorPaginate<IConversationDocument>({
        model: models.Conversations,
        params: {
          // orderBy: { createdAt: -1 }, // Optional, _id is used as a fallback
          // limit: params.limit || 20,
          // direction: 'forward', // or 'backward'
          // cursor: params.cursor, // Optional: should be an object with sort key(s)
          // cursorMode: 'exclusive', // Optional
        },
        query: qb.mainQuery(),
      });

    const conversations = await models.Conversations.find(qb.mainQuery())
      .sort({ updatedAt: -1 })
      .skip(params.skip || 0)
      .limit(params.limit || 0);
    serverTiming?.endTime('conversationsQuery');

    serverTiming?.endTime('conversations');
    console.log(conversations, 'conversations');
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
    const query = { conversationId };

    let messages: IMessageDocument[] = [];

    if (limit) {
      const sort: any = getFirst ? { createdAt: 1 } : { createdAt: -1 };

      messages = await models.ConversationMessages.find(query)
        .sort(sort)
        .skip(skip || 0)
        .limit(limit);

      return getFirst ? messages : messages.reverse();
    }

    messages = await models.ConversationMessages.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return messages.reverse();
  },

  /**
   *  Get all conversation messages count. We will use it in pager
   */
  async conversationMessagesTotalCount(
    _root,
    { conversationId }: { conversationId: string },
    { models }: IContext,
  ) {
    return models.ConversationMessages.countDocuments({ conversationId });
  },

  /**
   * Group conversation counts by brands, channels, integrations, status
   */
  async conversationCounts(
    _root,
    params: IListArgs,
    { user, models, subdomain }: IContext,
  ) {
    const { only } = params;

    const response: IConversationRes = {};
    const _user = {
      _id: user._id,
      code: user.code,
      starredConversationIds: user.starredConversationIds,
      role: user.role,
    };

    const qb = new QueryBuilder(models, subdomain, params, _user);

    await qb.buildAllQueries();

    const queries = qb.queries;
    const integrationIds = queries.integrations.integrationId.$in;

    if (only) {
      response[only] = await countByConversations(
        models,
        subdomain,
        params,
        integrationIds,
        _user,
        only,
      );
    }

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
    { _id, perPage, ...args }: { _id: string; perPage: number },
    { models }: IContext,
  ) {
    const query = { participatedUserIds: { $in: [_id] } };

    const { list, totalCount, pageInfo } =
      await cursorPaginate<IConversationDocument>({
        model: models.Conversations,
        params: {
          ...args,
          limit: perPage,
        },
        query: query,
      });

    return { list, totalCount, pageInfo };
  },
};
