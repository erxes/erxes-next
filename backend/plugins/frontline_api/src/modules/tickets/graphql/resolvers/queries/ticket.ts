import {
  cursorPaginate,
  regexSearchText,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { IContext, IModels } from '~/connectionResolvers';
import {
  IArchiveArgs,
  ITicketDocument,
  ITicketQueryParams,
} from '~/modules/tickets/@types/ticket';
import { TICKET_STATUSES } from '~/modules/tickets/constants';
import {
  calendarFilters,
  checkItemPermByUser,
  generateArchivedItemsFilter,
  generateExtraFilters,
  getCloseDateByType,
  getItemList,
} from '~/modules/tickets/utils';

export const generateFilter = async (
  models: IModels,
  currentUserId: string,
  args = {} as any,
  extraParams?: any,
) => {
  args.type = 'ticket';
  const { productIds } = extraParams || args;

  const {
    _ids,
    pipelineId,
    pipelineIds,
    stageId,
    parentId,
    boardIds,
    stageCodes,
    search,
    closeDateType,
    assignedUserIds,
    initialStageId,
    labelIds,
    priority,
    userIds,
    tagIds,
    assignedToMe,
    startDate,
    endDate,
    hasStartAndCloseDate,
    stageChangedStartDate,
    stageChangedEndDate,
    noSkipArchive,
    number,
    branchIds,
    departmentIds,
    dateRangeFilters,
    customFieldsDataFilters,
    resolvedDayBetween,
  } = args;

  const isListEmpty = (value) => {
    return value.length === 1 && value[0].length === 0;
  };

  let filter: any = noSkipArchive
    ? {}
    : { status: { $ne: TICKET_STATUSES.ARCHIVED }, parentId: undefined };

  if (parentId) {
    filter.parentId = parentId;
  }

  if (assignedUserIds) {
    // Filter by assigned to no one
    const notAssigned = isListEmpty(assignedUserIds);

    filter.assignedUserIds = notAssigned ? [] : { $in: assignedUserIds };
  }

  if (branchIds) {
    const branches = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'branches',
      action: 'findWithChild',
      input: {
        query: { _id: { $in: branchIds } },
        fields: { _id: 1 },
      },
      defaultValue: [],
    });

    filter.branchIds = { $in: branches.map((item) => item._id) };
  }

  if (departmentIds) {
    const departments = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'departments',
      action: 'findWithChild',
      input: {
        query: { _id: { $in: departmentIds } },
        fields: { _id: 1 },
      },
      defaultValue: [],
    });

    filter.departmentIds = { $in: departments.map((item) => item._id) };
  }

  if (_ids && _ids.length) {
    filter._id = { $in: _ids };
  }

  if (initialStageId) {
    filter.initialStageId = initialStageId;
  }

  if (closeDateType) {
    filter.closeDate = getCloseDateByType(closeDateType);
  }

  if (startDate) {
    filter.closeDate = {
      $gte: new Date(startDate),
    };
  }

  if (endDate) {
    if (filter.closeDate) {
      filter.closeDate.$lte = new Date(endDate);
    } else {
      filter.closeDate = {
        $lte: new Date(endDate),
      };
    }
  }

  if (dateRangeFilters) {
    for (const dateRangeFilter of dateRangeFilters) {
      const { name, from, to } = dateRangeFilter;

      if (from) {
        filter[name] = { $gte: new Date(from) };
      }

      if (to) {
        filter[name] = { ...filter[name], $lte: new Date(to) };
      }
    }
  }

  if (customFieldsDataFilters) {
    for (const { value, name } of customFieldsDataFilters) {
      if (Array.isArray(value) && value?.length) {
        filter[`customFieldsData.${name}`] = { $in: value };
      } else {
        filter[`customFieldsData.${name}`] = value;
      }
    }
  }

  const stageChangedDateFilter: any = {};
  if (stageChangedStartDate) {
    stageChangedDateFilter.$gte = new Date(stageChangedStartDate);
  }
  if (stageChangedEndDate) {
    stageChangedDateFilter.$lte = new Date(stageChangedEndDate);
  }
  if (Object.keys(stageChangedDateFilter).length) {
    filter.stageChangedDate = stageChangedDateFilter;
  }

  if (search) {
    Object.assign(filter, regexSearchText(search));
  }

  if (stageId) {
    filter.stageId = stageId;
  } else if (pipelineId || pipelineIds) {
    let filterPipeline = pipelineId;

    if (pipelineIds) {
      filterPipeline = { $in: pipelineIds };
    }

    const stageIds = await models.Stages.find({
      pipelineId: filterPipeline,
      status: { $ne: TICKET_STATUSES.ARCHIVED },
    }).distinct('_id');

    filter.stageId = { $in: stageIds };
  }

  if (boardIds) {
    const pipelineIds = await models.Pipelines.find({
      boardId: { $in: boardIds },
      status: { $ne: TICKET_STATUSES.ARCHIVED },
    }).distinct('_id');

    const filterStages: any = {
      pipelineId: { $in: pipelineIds },
      status: { $ne: TICKET_STATUSES.ARCHIVED },
    };

    if (filter?.stageId?.$in) {
      filterStages._id = { $in: filter?.stageId?.$in };
    }

    const stageIds = await models.Stages.find(filterStages).distinct('_id');

    filter.stageId = { $in: stageIds };
  }

  if (stageCodes) {
    const filterStages: any = { code: { $in: stageCodes } };

    if (filter?.stageId?.$in) {
      filterStages._id = { $in: filter?.stageId?.$in };
    }

    const stageIds = await models.Stages.find(filterStages).distinct('_id');

    filter.stageId = { $in: stageIds };
  }

  if (labelIds) {
    const isEmpty = isListEmpty(labelIds);

    filter.labelIds = isEmpty ? { $in: [null, []] } : { $in: labelIds };
  }

  if (priority) {
    filter.priority = { $eq: priority };
  }

  if (tagIds) {
    filter.tagIds = { $in: tagIds };
  }

  if (pipelineId) {
    const pipeline = await models.Pipelines.getPipeline(pipelineId);
    const user = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'users',
      action: 'findOne',
      input: {
        _id: currentUserId,
      },
      defaultValue: {},
    });
    const tmp =
      (await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'departments',
        action: 'findWithChild',
        input: {
          query: {
            supervisorId: currentUserId,
          },
          fields: {
            _id: 1,
          },
        },
        defaultValue: [],
      })) || [];

    const supervisorDepartmentIds = tmp?.map((x) => x._id) || [];
    const pipelineDepartmentIds = pipeline.departmentIds || [];

    const commonIds =
      supervisorDepartmentIds.filter((id) =>
        pipelineDepartmentIds.includes(id),
      ) || [];
    const isEligibleSeeAllCards = (pipeline.excludeCheckUserIds || []).includes(
      currentUserId,
    );
    if (
      commonIds?.length > 0 &&
      (pipeline.isCheckUser || pipeline.isCheckDepartment) &&
      !isEligibleSeeAllCards
    ) {
      // current user is supervisor in departments and this pipeline has included that some of user's departments
      // so user is eligible to see all cards of people who share same department.
      const otherDepartmentUsers = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'users',
        action: 'find',
        input: {
          query: { departmentIds: { $in: commonIds } },
        },
        defaultValue: [],
      });
      let includeCheckUserIds = otherDepartmentUsers.map((x) => x._id) || [];
      includeCheckUserIds = includeCheckUserIds.concat(user._id || []);

      const uqinueCheckUserIds = [
        ...new Set(includeCheckUserIds.concat(currentUserId)),
      ];

      Object.assign(filter, {
        $or: [
          { assignedUserIds: { $in: uqinueCheckUserIds } },
          { userId: { $in: uqinueCheckUserIds } },
        ],
      });
    } else if (
      (pipeline.isCheckUser || pipeline.isCheckDepartment) &&
      !isEligibleSeeAllCards
    ) {
      let includeCheckUserIds: string[] = [];

      if (pipeline.isCheckDepartment) {
        const userDepartmentIds = user?.departmentIds || [];
        const commonIds = userDepartmentIds.filter((id) =>
          pipelineDepartmentIds.includes(id),
        );

        const otherDepartmentUsers = await sendTRPCMessage({
          pluginName: 'core',
          method: 'query',
          module: 'users',
          action: 'find',
          input: {
            query: { departmentIds: { $in: commonIds } },
          },
          defaultValue: [],
        });

        for (const departmentUser of otherDepartmentUsers) {
          includeCheckUserIds = [...includeCheckUserIds, departmentUser._id];
        }

        if (
          pipelineDepartmentIds.filter((departmentId) =>
            userDepartmentIds.includes(departmentId),
          ).length
        ) {
          includeCheckUserIds = includeCheckUserIds.concat(user._id || []);
        }
      }

      const uqinueCheckUserIds = [
        ...new Set(includeCheckUserIds.concat(currentUserId)),
      ];

      Object.assign(filter, {
        $or: [
          { assignedUserIds: { $in: uqinueCheckUserIds } },
          { userId: { $in: uqinueCheckUserIds } },
        ],
      });
    }
  }

  if (userIds) {
    const isEmpty = isListEmpty(userIds);

    filter.userId = isEmpty ? { $in: [null, []] } : { $in: userIds };
  }

  if (assignedToMe) {
    filter.assignedUserIds = { $in: [currentUserId] };
  }

  //   if (segmentData) {
  //     const segment = JSON.parse(segmentData);
  //     const itemIds = await fetchSegment(subdomain, '', {}, segment);
  //     filter._id = { $in: itemIds };
  //   }

  //   if (segment) {
  //     const segmentObj = await sendTRPCMessage({
  //       pluginName: 'core',
  //       method: 'query',
  //       module: 'segment',
  //       action: 'findOne',
  //       input: { _id: segment },
  //       defaultValue: {},
  //     });
  //     const itemIds = await fetchSegment(subdomain, segmentObj);

  //     filter._id = { $in: itemIds };
  //   }

  if (hasStartAndCloseDate) {
    filter.startDate = { $exists: true };
    filter.closeDate = { $exists: true };
  }

  if (number) {
    filter.number = { $regex: `${number}`, $options: 'mui' };
  }

  //   if (vendorCustomerIds?.length > 0) {
  //     const cards = await sendCommonMessage({
  //       subdomain,
  //       serviceName: 'clientportal',
  //       action: 'clientPortalUserCards.find',
  //       data: {
  //         contentType: 'ticket',
  //         cpUserId: { $in: vendorCustomerIds },
  //       },
  //       isRPC: true,
  //       defaultValue: [],
  //     });
  //     const cardIds = cards.map((d) => d.contentTypeId);
  //     if (filter._id) {
  //       const ids = filter._id.$in;
  //       const newIds = ids.filter((d) => cardIds.includes(d));
  //       filter._id = { $in: newIds };
  //     } else {
  //       filter._id = { $in: cardIds };
  //     }
  //   }

  if ((stageId || stageCodes) && resolvedDayBetween) {
    const [dayFrom, dayTo] = resolvedDayBetween;
    filter.$expr = {
      $and: [
        // Convert difference between stageChangedDate and createdAt to days
        {
          $gte: [
            {
              $divide: [
                { $subtract: ['$stageChangedDate', '$createdAt'] },
                1000 * 60 * 60 * 24, // Convert milliseconds to days
              ],
            },
            dayFrom, // Minimum day (0 days)
          ],
        },
        {
          $lt: [
            {
              $divide: [
                { $subtract: ['$stageChangedDate', '$createdAt'] },
                1000 * 60 * 60 * 24,
              ],
            },
            dayTo, // Maximum day (3 days)
          ],
        },
      ],
    };
  }

  if (extraParams) {
    filter = await generateExtraFilters(filter, extraParams);
  }

  if (productIds) {
    filter['productsData.productId'] = { $in: productIds };
  }

  // Calendar monthly date
  await calendarFilters(models, filter, args);

  return filter;
};

export const ticketQueries = {
  /**
   * Tickets list
   */
  async tickets(
    _root: undefined,
    args: ITicketQueryParams,
    { user, models }: IContext,
  ) {
    const filter = await generateFilter(models, user._id, args);

    return await getItemList(models, filter, args, user);
  },

  async ticketsTotalCount(
    _root: undefined,
    args: ITicketQueryParams,
    { user, models }: IContext,
  ) {
    const filter = {
      ...(await generateFilter(models, user._id, args)),
    };

    return models.Tickets.find(filter).countDocuments();
  },

  /**
   * Archived list
   */
  async archivedTickets(
    _root: undefined,
    args: IArchiveArgs,
    { models }: IContext,
  ) {
    const { pipelineId } = args;

    const stages = await models.Stages.find({ pipelineId }).lean();

    if (stages.length > 0) {
      const filter = generateArchivedItemsFilter(args, stages);

      const { list, pageInfo, totalCount } =
        await cursorPaginate<ITicketDocument>({
          model: models.Tickets,
          params: args,
          query: filter,
        });

      return { list, pageInfo, totalCount };
    }

    return {};
  },

  async archivedTicketsCount(
    _root: undefined,
    args: IArchiveArgs,
    { models }: IContext,
  ) {
    const { pipelineId } = args;

    const stages = await models.Stages.find({ pipelineId });

    if (stages.length > 0) {
      const filter = generateArchivedItemsFilter(args, stages);

      return models.Tickets.find(filter).countDocuments();
    }

    return 0;
  },

  /**
   * Tickets detail
   */
  async ticketDetail(
    _root: undefined,
    { _id }: { _id: string },
    { user, models }: IContext,
  ) {
    const ticket = await models.Tickets.getTicket(_id);

    return checkItemPermByUser(models, user, ticket);
  },
};
