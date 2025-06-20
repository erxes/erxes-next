import { IUserDocument } from 'erxes-api-shared/core-types';
import {
  getNextMonth,
  getToday,
  graphqlPubsub,
  regexSearchText,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import moment from 'moment';
import * as _ from 'underscore';
import resolvers from '~/apollo/resolvers';
import { IModels } from '~/connectionResolvers';
import { IStageDocument } from '~/modules/tasks/@types/stages';
import {
  IArchivedTaskQueryParams,
  ITask,
  ITaskDocument,
} from '~/modules/tasks/@types/tasks';
import { CLOSE_DATE_TYPES, TASK_STATUSES } from '~/modules/tasks/constants';
import { configReplacer } from '~/modules/tasks/utils';

export const itemResolver = async (models: IModels, user: any, item: ITask) => {
  const additionInfo = {};
  const resolver = resolvers['Task'] || {};

  for (const subResolver of Object.keys(resolver)) {
    try {
      additionInfo[subResolver] = await resolver[subResolver](
        item,
        {},
        { models, user },
        { isSubscription: true },
      );
    } catch (unused) {
      continue;
    }
  }

  return additionInfo;
};

export const checkNumberConfig = async (
  numberConfig: string,
  numberSize: string,
) => {
  if (!numberConfig) {
    throw new Error('Please input number configuration.');
  }

  if (!numberSize) {
    throw new Error('Please input fractional part.');
  }

  const replaced = await configReplacer(numberConfig);
  const re = /[0-9]$/;

  if (re.test(replaced)) {
    throw new Error(
      `Please make sure that the number configuration itself doesn't end with any number.`,
    );
  }

  return;
};

export const bulkUpdateOrders = async ({
  collection,
  stageId,
  sort = { order: 1 },
  additionFilter = {},
  startOrder = 100,
}: {
  collection: any;
  stageId: string;
  sort?: { [key: string]: any };
  additionFilter?: any;
  startOrder?: number;
}) => {
  const bulkOps: Array<{
    updateOne: {
      filter: { _id: string };
      update: { order: number };
    };
  }> = [];

  let ord = startOrder;

  const allItems = await collection
    .find(
      {
        stageId,
        status: { $ne: TASK_STATUSES.ARCHIVED },
        ...additionFilter,
      },
      { _id: 1, order: 1 },
    )
    .sort(sort);

  for (const item of allItems) {
    bulkOps.push({
      updateOne: {
        filter: { _id: item._id },
        update: { order: ord },
      },
    });

    ord += 10;
  }

  if (!bulkOps.length) {
    return '';
  }

  await collection.bulkWrite(bulkOps);
  return 'ok';
};

export const getAmountsMap = async (
  models,
  collection,
  user,
  args,
  stage,
  tickUsed = true,
) => {
  const amountsMap = {};
  const filter = await generateFilter(
    models,
    user._id,
    { ...args, stageId: stage._id, pipelineId: stage.pipelineId },
    args.extraParams,
  );

  const amountList = await collection.aggregate([
    {
      $match: filter,
    },
    {
      $unwind: '$productsData',
    },
    {
      $project: {
        amount: '$productsData.amount',
        currency: '$productsData.currency',
        tickUsed: '$productsData.tickUsed',
      },
    },
    {
      $match: { tickUsed },
    },
    {
      $group: {
        _id: '$currency',
        amount: { $sum: '$amount' },
      },
    },
  ]);

  amountList.forEach((item) => {
    if (item._id) {
      amountsMap[item._id] = item.amount;
    }
  });
  return amountsMap;
};

export const getCloseDateByType = (closeDateType: string) => {
  if (closeDateType === CLOSE_DATE_TYPES.NEXT_DAY) {
    const tomorrow = moment().add(1, 'days');

    return {
      $gte: new Date(tomorrow.startOf('day').toISOString()),
      $lte: new Date(tomorrow.endOf('day').toISOString()),
    };
  }

  if (closeDateType === CLOSE_DATE_TYPES.NEXT_WEEK) {
    const monday = moment()
      .day(1 + 7)
      .format('YYYY-MM-DD');
    const nextSunday = moment()
      .day(7 + 7)
      .format('YYYY-MM-DD');

    return {
      $gte: new Date(monday),
      $lte: new Date(nextSunday),
    };
  }

  if (closeDateType === CLOSE_DATE_TYPES.NEXT_MONTH) {
    const now = new Date();
    const { start, end } = getNextMonth(now);

    return {
      $gte: new Date(start),
      $lte: new Date(end),
    };
  }

  if (closeDateType === CLOSE_DATE_TYPES.NO_CLOSE_DATE) {
    return { $exists: false };
  }

  if (closeDateType === CLOSE_DATE_TYPES.OVERDUE) {
    const now = new Date();
    const today = getToday(now);

    return { $lt: today };
  }
};

const dateSelector = (date: { month: number; year: number }) => {
  const { year, month } = date;

  const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));

  return {
    $gte: start,
    $lte: end,
  };
};

export const generateExtraFilters = async (filter, extraParams) => {
  const {
    source,
    userIds,
    priority,
    startDate,
    endDate,
    createdStartDate,
    createdEndDate,
    stateChangedStartDate,
    stateChangedEndDate,
    startDateStartDate,
    startDateEndDate,
    closeDateStartDate,
    closeDateEndDate,
  } = extraParams;

  const isListEmpty = (value) => {
    return value.length === 1 && value[0].length === 0;
  };

  if (source) {
    filter.source = { $in: source };
  }

  if (userIds) {
    const isEmpty = isListEmpty(userIds);

    filter.userId = isEmpty ? { $in: [null, []] } : { $in: userIds };
  }

  if (priority) {
    filter.priority = { $in: priority };
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

  if (createdStartDate || createdEndDate) {
    filter.createdAt = {
      $gte: new Date(createdStartDate),
      $lte: new Date(createdEndDate),
    };
  }

  if (stateChangedStartDate || stateChangedEndDate) {
    filter.stageChangedDate = {
      $gte: new Date(stateChangedStartDate),
      $lte: new Date(stateChangedEndDate),
    };
  }

  if (startDateStartDate || startDateEndDate) {
    filter.startDate = {
      $gte: new Date(startDateStartDate),
      $lte: new Date(startDateEndDate),
    };
  }

  if (closeDateStartDate || closeDateEndDate) {
    filter.closeDate = {
      $gte: new Date(closeDateStartDate),
      $lte: new Date(closeDateEndDate),
    };
  }

  return filter;
};

export const calendarFilters = async (models: IModels, filter, args) => {
  const {
    date,
    pipelineId,
    createdStartDate,
    createdEndDate,
    stateChangedStartDate,
    stateChangedEndDate,
    startDateStartDate,
    startDateEndDate,
    closeDateStartDate,
    closeDateEndDate,
  } = args;

  if (date) {
    const stageIds = await models.Stages.find({ pipelineId }).distinct('_id');

    filter.closeDate = dateSelector(date);
    filter.stageId = { $in: stageIds };
  }

  if (createdStartDate || createdEndDate) {
    filter.createdAt = {
      $gte: new Date(createdStartDate),
      $lte: new Date(createdEndDate),
    };
  }
  if (stateChangedStartDate || stateChangedEndDate) {
    filter.stageChangedDate = {
      $gte: new Date(stateChangedStartDate),
      $lte: new Date(stateChangedEndDate),
    };
  }
  if (startDateStartDate || startDateEndDate) {
    filter.startDate = {
      $gte: new Date(startDateStartDate),
      $lte: new Date(startDateEndDate),
    };
  }
  if (closeDateStartDate || closeDateEndDate) {
    filter.closeDate = {
      $gte: new Date(closeDateStartDate),
      $lte: new Date(closeDateEndDate),
    };
  }

  return filter;
};

export const generateFilter = async (
  models: IModels,
  currentUserId: string,
  args = {} as any,
  extraParams?: any,
) => {
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

  const { productIds } = extraParams || args;

  const isListEmpty = (value) => {
    return value.length === 1 && value[0].length === 0;
  };

  const filter: any = noSkipArchive
    ? {}
    : { status: { $ne: TASK_STATUSES.ARCHIVED }, parentId: undefined };

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
      status: { $ne: TASK_STATUSES.ARCHIVED },
    }).distinct('_id');

    filter.stageId = { $in: stageIds };
  }

  if (boardIds) {
    const pipelineIds = await models.Pipelines.find({
      boardId: { $in: boardIds },
      status: { $ne: TASK_STATUSES.ARCHIVED },
    }).distinct('_id');

    const filterStages: any = {
      pipelineId: { $in: pipelineIds },
      status: { $ne: TASK_STATUSES.ARCHIVED },
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
        query: {
          _id: currentUserId,
        },
      },
      defaultValue: {},
    });

    const departments = await sendTRPCMessage({
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
    });

    const supervisorDepartmentIds = departments?.map((x) => x._id) || [];
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

  if (hasStartAndCloseDate) {
    filter.startDate = { $exists: true };
    filter.closeDate = { $exists: true };
  }

  if (number) {
    filter.number = { $regex: `${number}`, $options: 'mui' };
  }

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
    await generateExtraFilters(filter, extraParams);
  }

  if (productIds) {
    filter['productsData.productId'] = { $in: productIds };
  }

  // Calendar monthly date
  await calendarFilters(models, filter, args);

  return filter;
};

export const generateArchivedTasksFilter = (
  params: IArchivedTaskQueryParams,
  stages: IStageDocument[],
) => {
  const {
    search,
    userIds,
    priorities,
    assignedUserIds,
    labelIds,
    productIds,
    startDate,
    endDate,
    sources,
    hackStages,
  } = params;

  const filter: any = { status: TASK_STATUSES.ARCHIVED };

  filter.stageId = { $in: stages.map((stage) => stage._id) };

  if (search) {
    Object.assign(filter, regexSearchText(search, 'name'));
  }

  if (userIds && userIds.length) {
    filter.userId = { $in: userIds };
  }

  if (priorities && priorities.length) {
    filter.priority = { $in: priorities };
  }

  if (assignedUserIds && assignedUserIds.length) {
    filter.assignedUserIds = { $in: assignedUserIds };
  }

  if (labelIds && labelIds.length) {
    filter.labelIds = { $in: labelIds };
  }

  if (productIds && productIds.length) {
    filter['productsData.productId'] = { $in: productIds };
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

  if (sources && sources.length) {
    filter.source = { $in: sources };
  }

  if (hackStages && hackStages.length) {
    filter.hackStages = { $in: hackStages };
  }

  return filter;
};

export const compareDepartmentIds = (
  pipelineDepartmentIds: string[],
  userDepartmentIds: string[],
): boolean => {
  if (!pipelineDepartmentIds?.length || !userDepartmentIds?.length) {
    return false;
  }

  for (const uDepartmentId of userDepartmentIds) {
    if (pipelineDepartmentIds.includes(uDepartmentId)) {
      return true;
    }
  }

  return false;
};

const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const orderHelper = (aboveOrder, belowOrder) => {
  // empty stage
  if (!aboveOrder && !belowOrder) {
    return 100;
  }

  // end of stage
  if (!belowOrder) {
    return aboveOrder + 10;
  }

  // begin of stage
  if (!aboveOrder) {
    return randomBetween(0, belowOrder);
  }

  // between items on stage
  return randomBetween(aboveOrder, belowOrder);
};

export const getNewOrder = async ({
  collection,
  stageId,
  aboveItemId,
}: {
  collection: any;
  stageId: string;
  aboveItemId?: string;
}) => {
  const aboveItem = await collection.findOne({ _id: aboveItemId });

  const aboveOrder = aboveItem?.order || 0;

  const belowItems = await collection
    .find({
      stageId,
      order: { $gt: aboveOrder },
      status: { $ne: TASK_STATUSES.ARCHIVED },
    })
    .sort({ order: 1 })
    .limit(1);

  const belowOrder = belowItems[0]?.order;

  const order = orderHelper(aboveOrder, belowOrder);

  // if duplicated order, then in stages items bulkUpdate 100, 110, 120, 130
  if ([aboveOrder, belowOrder].includes(order)) {
    await bulkUpdateOrders({ collection, stageId });

    return getNewOrder({ collection, stageId, aboveItemId });
  }

  return order;
};

/**
 * Copies pipeline labels alongside task when they are moved between different pipelines.
 */
export const copyPipelineLabels = async (
  models: IModels,
  params: {
    item: ITaskDocument;
    doc: any;
    user: IUserDocument;
  },
) => {
  const { item, doc, user } = params;

  const oldStage = await models.Stages.findOne({ _id: item.stageId }).lean();
  const newStage = await models.Stages.findOne({ _id: doc.stageId }).lean();

  if (!(oldStage && newStage)) {
    throw new Error('Stage not found');
  }

  if (oldStage.pipelineId === newStage.pipelineId) {
    return;
  }

  const oldLabels = await models.PipelineLabels.find({
    _id: { $in: item.labelIds },
  }).lean();

  const updatedLabelIds: string[] = [];

  const existingLabels = await models.PipelineLabels.find({
    name: { $in: oldLabels.map((o) => o.name) },
    colorCode: { $in: oldLabels.map((o) => o.colorCode) },
    pipelineId: newStage.pipelineId,
  }).lean();

  // index using only name and colorCode, since all pipelineIds are same
  const existingLabelsByUnique = _.indexBy(
    existingLabels,
    ({ name, colorCode }) => JSON.stringify({ name, colorCode }),
  );

  // Collect labels that don't exist on the new stage's pipeline here
  const notExistingLabels: any[] = [];

  for (const label of oldLabels) {
    const exists =
      existingLabelsByUnique[
        JSON.stringify({ name: label.name, colorCode: label.colorCode })
      ];
    if (!exists) {
      notExistingLabels.push({
        name: label.name,
        colorCode: label.colorCode,
        pipelineId: newStage.pipelineId,
        createdAt: new Date(),
        createdBy: user._id,
      });
    } else {
      updatedLabelIds.push(exists._id);
    }
  } // end label loop

  // Insert labels that don't already exist on the new stage's pipeline
  const newLabels = await models.PipelineLabels.insertMany(notExistingLabels, {
    ordered: false,
  });

  for (const newLabel of newLabels) {
    updatedLabelIds.push(newLabel._id);
  }

  await models.PipelineLabels.labelsLabel(item._id, updatedLabelIds);
};

export const changeItemStatus = async (
  models: IModels,
  user: any,
  {
    item,
    status,
    proccessId,
    stage,
  }: {
    item: any;
    status: string;
    proccessId: string;
    stage: IStageDocument;
  },
) => {
  if (status === 'archived') {
    graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: 'itemRemove',
        data: {
          item,
          oldStageId: item.stageId,
        },
      },
    });

    return;
  }

  const aboveItems = await models.Tasks.find({
    stageId: item.stageId,
    status: { $ne: TASK_STATUSES.ARCHIVED },
    order: { $lt: item.order },
  })
    .sort({ order: -1 })
    .limit(1);

  const aboveItemId = aboveItems[0]?._id || '';

  // maybe, recovered order includes to oldOrders
  await models.Tasks.updateOne(
    {
      _id: item._id,
    },
    {
      order: await getNewOrder({
        collection: models.Tasks,
        stageId: item.stageId,
        aboveItemId,
      }),
    },
  );

  graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
    tasksPipelinesChanged: {
      _id: stage.pipelineId,
      proccessId,
      action: 'itemAdd',
      data: {
        item: {
          ...item._doc,
          ...(await itemResolver(models, user, item)),
        },
        aboveItemId,
        destinationStageId: item.stageId,
      },
    },
  });
};

export const itemMover = async (
  models: IModels,
  userId: string,
  item: ITaskDocument,
  destinationStageId: string,
) => {
  const oldStageId = item.stageId;

  let action = `changed order of your task:`;
  let content = `'${item.name}'`;

  if (oldStageId !== destinationStageId) {
    const stage = await models.Stages.getStage(destinationStageId);
    const oldStage = await models.Stages.getStage(oldStageId);

    const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);
    const oldPipeline = await models.Pipelines.getPipeline(oldStage.pipelineId);

    const board = await models.Boards.getBoard(pipeline.boardId);
    const oldBoard = await models.Boards.getBoard(oldPipeline.boardId);

    action = `moved '${item.name}' from ${oldBoard.name}-${oldPipeline.name}-${oldStage.name} to `;

    content = `${board.name}-${pipeline.name}-${stage.name}`;

    //   const link = `/${contentType}/board?id=${board._id}&pipelineId=${pipeline._id}&itemId=${item._id}`;

    //   const activityLogContent = {
    //     oldStageId,
    //     destinationStageId,
    //     text: `${oldStage.name} to ${stage.name}`
    //   };

    //   await putActivityLog(subdomain, {
    //     action: "createBoardItemMovementLog",
    //     data: {
    //       item,
    //       contentType,
    //       userId,
    //       activityLogContent,
    //       link,
    //       action: "moved",
    //       contentId: item._id,
    //       createdBy: userId,
    //       content: activityLogContent
    //     }
    //   });

    //   sendNotificationsMessage({
    //     subdomain,
    //     action: "batchUpdate",
    //     data: {
    //       selector: { contentType, contentTypeId: item._id },
    //       modifier: { $set: { link } }
    //     }
    //   });
  }

  return { content, action };
};

export const checkMovePermission = (
  stage: IStageDocument,
  user: IUserDocument,
) => {
  if (
    stage.canMoveMemberIds &&
    stage.canMoveMemberIds.length > 0 &&
    !stage.canMoveMemberIds.includes(user._id)
  ) {
    throw new Error('Permission denied');
  }
};
