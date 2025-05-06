import { defaultPaginate } from 'erxes-api-shared/src/utils';
import { IContext } from '~/connectionResolvers';
/**
 * Common helper for integrations & integrationsTotalCount
 */
const generateFilterQuery = async (
  subdomain,
  { kind, channelId, brandId, searchValue, tag, status, formLoadType },
  models,
) => {
  const query: any = {};

  if (kind) {
    query.kind = kind;
  }

  // filter integrations by channel
  if (channelId) {
    const channel = await models.Channels.getChannel(channelId);
    query._id = { $in: channel.integrationIds || [] };
  }

  // filter integrations by brand
  if (brandId) {
    query.brandId = brandId;
  }

  if (searchValue) {
    query.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  // filtering integrations by tag

  if (status) {
    query.isActive = status === 'active' ? true : false;
  }

  return query;
};

export const integrationQueries = {
  /**
   * Integrations list
   */
  async integrations(
    _root,
    args: {
      page: number;
      perPage: number;
      kind: string;

      searchValue: string;
      channelId: string;
      brandId: string;
      tag: string;
      status: string;
      formLoadType: string;
      sortField: string;
      sortDirection: number;
    },
    { singleBrandIdSelector, models, subdomain, user }: IContext,
  ) {
    if (!user) {
      throw new Error('User not authenticated');
    }
    let query = {
      ...singleBrandIdSelector,
      ...(await generateFilterQuery(subdomain, args, models)),
    };
    if (!user.isOwner) {
      query = {
        ...query,
        $or: [
          { visibility: { $exists: null } },
          { visibility: 'public' },
          {
            $and: [
              { visibility: 'private' },
              {
                $or: [
                  { createdUserId: user._id },
                  { departmentIds: { $in: user?.departmentIds || [] } },
                ],
              },
            ],
          },
        ],
      };
    }

    if (args.kind === 'lead') {
      return models.Integrations.findLeadIntegrations(query, args);
    }

    const integrations = defaultPaginate(
      models.Integrations.findAllIntegrations(query),
      args,
    );

    return integrations.sort({ name: 1 });
  },

  /**
   * Get lead all integration list
   */
  async allLeadIntegrations(
    _root,
    _args,
    { singleBrandIdSelector, models }: IContext,
  ) {
    const query = {
      ...singleBrandIdSelector,
      kind: 'lead',
    };

    return models.Integrations.findAllIntegrations(query).sort({ name: 1 });
  },

  /**
   * Get used integration types
   */
  async integrationsGetUsedTypes(_root, { object }, { models }: IContext) {
    const usedTypes: Array<{ _id: string; name: string }> = [];

    return usedTypes;
  },

  /**
   * Get one integration
   */
  async integrationDetail(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Integrations.findOne({ _id });
  },

  /**
   * Get all integrations count. We will use it in pager
   */
  async integrationsTotalCount(
    _root,
    args: {
      kind: string;
      channelId: string;
      brandId: string;
      tag: string;
      searchValue: string;
      status: string;
      formLoadType: string;
    },
    { models, subdomain }: IContext,
  ) {
    const counts = {
      total: 0,
      byTag: {},
      byChannel: {},
      byBrand: {},
      byKind: {},
      byStatus: { active: 0, archived: 0 },
    };

    const qry = {
      ...(await generateFilterQuery(subdomain, args, models)),
    };

    const count = async (query) => {
      return models.Integrations.findAllIntegrations(query).countDocuments();
    };

    // Counting integrations by tag

    // Counting integrations by kind

    // Counting integrations by channel

    counts.byStatus.active = await count({ isActive: true, ...qry });
    counts.byStatus.archived = await count({ isActive: false, ...qry });

    if (args.status) {
      if (args.status === 'active') {
        counts.byStatus.archived = 0;
      } else {
        counts.byStatus.active = 0;
      }
    }

    // Counting all integrations without any filter
    counts.total = await count(qry);

    return counts;
  },

  async integrationGetLineWebhookUrl(
    _root,
    { _id }: { _id: string },
    { subdomain }: IContext,
  ) {
    return 'success';
  },
};
