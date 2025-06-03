import * as _ from 'underscore';

import { CONVERSATION_STATUSES } from '@/inbox/db/definitions/constants';
import { IModels } from '~/connectionResolvers';
import { fixDate } from 'erxes-api-shared/utils';

interface IIn {
  $in: string[];
}

interface IOR {
  $or: IDateFilter[];
}

interface IExists {
  $exists: boolean;
}

export interface IListArgs {
  limit?: number;
  channelId?: string;
  status?: string;
  unassigned?: string;
  awaitingResponse?: string;
  brandId?: string;
  tag?: string;
  integrationType?: string;
  participating?: string;
  starred?: string;
  ids?: string[];
  startDate?: string;
  endDate?: string;
  only?: string;
  page?: number;
  perPage?: number;
  sortField?: string;
  sortDirection?: number;
  segment?: string;
  searchValue?: string;
  skip?: number;
}

interface IUserArgs {
  _id: string;
  code?: string;
  starredConversationIds?: string[];
  role?: string;
}

interface IIntersectIntegrationIds {
  integrationId: IIn;
}

interface IUnassignedFilter {
  assignedUserId: IExists;
}

interface IDateFilter {
  [key: string]: IDate;
}

interface IDate {
  $gte: Date;
  $lte: Date;
}

export default class Builder {
  public models: IModels;
  public subdomain: string;
  public params: IListArgs;
  public user: IUserArgs;
  public queries: any;
  public unassignedQuery?: IUnassignedFilter;
  public activeIntegrationIds: string[] = [];

  constructor(
    models: IModels,
    subdomain: string,
    params: IListArgs,
    user: IUserArgs,
  ) {
    this.models = models;
    this.subdomain = subdomain;
    this.params = params;
    this.user = user;
  }

  // filter by segment
  // incomplete

  public userRelevanceQuery() {
    return [
      { userRelevance: { $exists: false } },
      { userRelevance: new RegExp(this.user.code || '') },
    ];
  }

  public async defaultFilters(): Promise<any> {
    const activeIntegrations = await this.models.Integrations.find({
      isActive: { $ne: false },
    });

    this.activeIntegrationIds = activeIntegrations.map((integ) => integ._id);

    let statusFilter = this.statusFilter([
      CONVERSATION_STATUSES.NEW,
      CONVERSATION_STATUSES.OPEN,
    ]);

    if (this.params.status === 'closed') {
      statusFilter = this.statusFilter([CONVERSATION_STATUSES.CLOSED]);
    }

    return statusFilter;
  }

  public async intersectIntegrationIds(
    ...queries: Array<{ integrationId?: { $in: string[] } }>
  ): Promise<{ integrationId: { $in: string[] } }> {
    const inQueries = queries
      .map((q) => q.integrationId?.$in)
      .filter((ids): ids is string[] => Array.isArray(ids) && ids.length > 0);

    const intersectedIds = inQueries.length ? _.intersection(...inQueries) : [];

    return { integrationId: { $in: intersectedIds } };
  }

  /*
   * find integrationIds from channel && brand
   */
  public async integrationsFilter(): Promise<IIntersectIntegrationIds> {
    const isSystemUser = this.user.role === 'system';
    const channelQuery = isSystemUser ? {} : { memberIds: this.user._id };

    const channels = await this.models.Channels.find(channelQuery);

    if (!channels.length) {
      return { integrationId: { $in: [] } };
    }

    // Get all active integrationIds from channels
    const availIntegrationIds = _.chain(channels)
      .map('integrationIds')
      .flatten()
      .uniq()
      .filter((id) => this.activeIntegrationIds.includes(id))
      .value();

    const nestedQueries: Array<{ integrationId: { $in: string[] } }> = [
      { integrationId: { $in: availIntegrationIds } },
    ];

    if (this.params.channelId) {
      const channelFilter = await this.channelFilter(this.params.channelId);
      nestedQueries.push(channelFilter);
    }

    if (this.params.brandId) {
      const brandFilter = await this.brandFilter(this.params.brandId);
      if (brandFilter) {
        nestedQueries.push(brandFilter);
      }
    }

    return this.intersectIntegrationIds(...nestedQueries);
  }

  // filter by channel
  public async channelFilter(
    channelId: string,
  ): Promise<{ integrationId: IIn }> {
    const channel = await this.models.Channels.getChannel(channelId);
    const memberIds = channel.memberIds || [];

    if (!memberIds.includes(this.user._id)) {
      return {
        integrationId: {
          $in: [],
        },
      };
    }

    return {
      integrationId: {
        $in: (channel.integrationIds || []).filter((id) =>
          this.activeIntegrationIds.includes(id),
        ),
      },
    };
  }

  // filter by brand
  public async brandFilter(
    brandId: string,
  ): Promise<{ integrationId: IIn } | undefined> {
    const integrations = await this.models.Integrations.findIntegrations({
      brandId,
    });

    if (integrations.length === 0) {
      return;
    }

    const integrationIds = _.pluck(integrations, '_id');
    return {
      integrationId: { $in: integrationIds },
    };
  }

  // filter all unassigned
  public unassignedFilter(): IUnassignedFilter {
    this.unassignedQuery = {
      assignedUserId: { $exists: false },
    };

    return this.unassignedQuery;
  }

  // filter by participating
  public participatingFilter(): { $or: object[] } {
    return {
      $or: [
        { participatedUserIds: { $in: [this.user._id] } },
        { assignedUserId: this.user._id },
      ],
    };
  }

  // filter by starred
  public starredFilter(): { _id: IIn | { $in: string[] } } {
    return {
      _id: {
        $in: this.user.starredConversationIds || [],
      },
    };
  }

  public statusFilter(statusChoices: string[]): { status: IIn } {
    return {
      status: { $in: statusChoices },
    };
  }

  // filter by awaiting Response
  public awaitingResponse(): { isCustomerRespondedLast: boolean } {
    return {
      isCustomerRespondedLast: true,
    };
  }

  // filter by integration type
  public async integrationTypeFilter(
    integrationType: string,
  ): Promise<IIntersectIntegrationIds[]> {
    const integrations = await this.models.Integrations.findIntegrations({
      kind: integrationType,
    });

    return [
      // add channel && brand filter
      this.queries.integrations,

      // filter by integration type
      { integrationId: { $in: _.pluck(integrations, '_id') } },
    ];
  }

  // filter by tag
  //incomplete
  public dateFilter(startDate: string, endDate: string): IOR {
    return {
      $or: [
        {
          createdAt: {
            $gte: fixDate(startDate),
            $lte: fixDate(endDate),
          },
        },
        {
          updatedAt: {
            $gte: fixDate(startDate),
            $lte: fixDate(endDate),
          },
        },
      ],
    };
  }

  public async extendedQueryFilter({ integrationType }: IListArgs) {
    return {
      $and: [
        ...(integrationType
          ? await this.integrationTypeFilter(integrationType)
          : []),
      ],
    };
  }

  /*
   * prepare all queries. do not do any action
   */
  public async buildAllQueries(): Promise<void> {
    this.queries = {
      default: await this.defaultFilters(),
      starred: {},
      status: {},
      unassigned: {},
      tag: {},
      channel: {},
      integrationType: {},

      // find it using channel && brand
      integrations: {},

      participating: {},
      createdAt: {},
      segments: {},
    };

    // filter by channel
    if (this.params.channelId) {
      this.queries.channel = await this.channelFilter(this.params.channelId);
    }

    // filter by channelId & brandId
    this.queries.integrations = await this.integrationsFilter();

    // unassigned
    if (this.params.unassigned) {
      this.queries.unassigned = this.unassignedFilter();
    }

    // participating
    if (this.params.participating) {
      this.queries.participating = this.participatingFilter();
    }

    // starred
    if (this.params.starred) {
      this.queries.starred = this.starredFilter();
    }

    // awaiting response
    if (this.params.awaitingResponse) {
      this.queries.awaitingResponse = this.awaitingResponse();
    }

    // filter by status
    if (this.params.status) {
      this.queries.status = this.statusFilter([this.params.status]);
    }

    // filter by tag

    if (this.params.startDate && this.params.endDate) {
      this.queries.createdAt = this.dateFilter(
        this.params.startDate,
        this.params.endDate,
      );
    }

    // filter by segment

    this.queries.extended = await this.extendedQueryFilter(this.params);
  }

  public mainQuery(): any {
    return {
      ...this.queries.default,
      ...this.queries.integrations,
      ...this.queries.extended,
      ...this.queries.unassigned,
      ...this.queries.participating,
      ...this.queries.status,
      ...this.queries.starred,
      ...this.queries.tag,
      ...this.queries.createdAt,
      ...this.queries.awaitingResponse,
      ...this.queries.segments,
    };
  }
}
