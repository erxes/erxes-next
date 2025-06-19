import { IUserDocument } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  getNextMonth,
  getToday,
  regexSearchText,
  sendTRPCMessage,
  USER_ROLES,
  validSearchText,
} from 'erxes-api-shared/utils';
import moment from 'moment-timezone';
import { DeleteResult } from 'mongoose';
import * as _ from 'underscore';
import resolvers from '~/apollo/resolvers';
import { IModels } from '~/connectionResolvers';
import { IPipeline } from '~/modules/tickets/@types/pipeline';
import { IStage, IStageDocument } from '~/modules/tickets/@types/stage';
import {
  IArchiveArgs,
  ITicket,
  ITicketDocument,
  ITicketQueryParams,
} from '~/modules/tickets/@types/ticket';
import { CLOSE_DATE_TYPES, TICKET_STATUSES } from '~/modules/tickets/constants';
import { generateFilter } from '~/modules/tickets/graphql/resolvers/queries/ticket';

export const fillSearchTextItem = (doc: ITicket, item?: ITicket) => {
  const document = item || { name: '', description: '' };
  Object.assign(document, doc);

  return validSearchText([document.name || '', document.description || '']);
};

export const configReplacer = (config) => {
  const now = new Date();

  // replace type of date
  return config
    .replace(/\{year}/g, now.getFullYear().toString())
    .replace(/\{month}/g, `0${(now.getMonth() + 1).toString()}`.slice(-2))
    .replace(/\{day}/g, `0${now.getDate().toString()}`.slice(-2));
};

// board item number calculator
const numberCalculator = (size: number, num?: any, skip?: boolean) => {
  if (num && !skip) {
    num = parseInt(num, 10) + 1;
  }

  if (skip) {
    num = 0;
  }

  num = num.toString();

  while (num.length < size) {
    num = '0' + num;
  }

  return num;
};

export const boardNumberGenerator = async (
  models: IModels,
  config: string,
  size: string,
  skip: boolean,
  type?: string,
) => {
  const replacedConfig = await configReplacer(config);
  const re = replacedConfig + '[0-9]+$';

  let number;

  if (!skip) {
    const pipeline = await models.Pipelines.findOne({
      lastNum: new RegExp(re),
      type,
    });

    if (pipeline?.lastNum) {
      const lastNum = pipeline.lastNum;

      const lastGeneratedNumber = lastNum.slice(replacedConfig.length);

      number =
        replacedConfig +
        (await numberCalculator(parseInt(size, 10), lastGeneratedNumber));

      return number;
    }
  }

  number =
    replacedConfig + (await numberCalculator(parseInt(size, 10), '', skip));

  return number;
};

export const generateLastNum = async (models: IModels, doc: IPipeline) => {
  const replacedConfig = await configReplacer(doc.numberConfig);
  const re = replacedConfig + '[0-9]+$';

  const pipeline = await models.Pipelines.findOne({
    lastNum: new RegExp(re),
    type: doc.type,
  });

  if (pipeline) {
    return pipeline.lastNum;
  }

  const tickets = await models.Tickets.findOne({
    number: new RegExp(re),
  });

  if (tickets) {
    return tickets.number;
  }

  // generate new number by new numberConfig
  const generatedNum = await boardNumberGenerator(
    models,
    doc.numberConfig || '',
    doc.numberSize || '',
    true,
  );

  return generatedNum;
};

export const createOrUpdatePipelineStages = async (
  models: IModels,
  stages: IStageDocument[],
  pipelineId: string,
): Promise<DeleteResult> => {
  let order = 0;

  const validStageIds: string[] = [];
  const bulkOpsPrevEntry: Array<{
    updateOne: {
      filter: { _id: string };
      update: { $set: IStage };
    };
  }> = [];
  const prevItemIds = stages.map((stage) => stage._id);

  const prevEntries = await models.Stages.find({ _id: { $in: prevItemIds } });
  const prevEntriesIds = prevEntries.map((entry) => entry._id);

  const selector = { pipelineId, _id: { $nin: prevItemIds } };

  const stageIds = await models.Stages.find(selector).distinct('_id');

  await models.Tickets.deleteMany({ stageId: { $in: stageIds } });

  await models.Stages.deleteMany(selector);

  for (const stage of stages) {
    order++;

    const doc: any = { ...stage, order, pipelineId };

    const _id = doc._id;

    const prevEntry = prevEntriesIds.includes(_id);

    // edit
    if (prevEntry) {
      validStageIds.push(_id);

      bulkOpsPrevEntry.push({
        updateOne: {
          filter: {
            _id,
          },
          update: {
            $set: doc,
          },
        },
      });
      // create
    } else {
      delete doc._id;
      const createdStage = await models.Stages.createStage(doc);
      validStageIds.push(createdStage._id);
    }
  }

  if (bulkOpsPrevEntry.length > 0) {
    await models.Stages.bulkWrite(bulkOpsPrevEntry);
  }

  return models.Stages.deleteMany({ pipelineId, _id: { $nin: validStageIds } });
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
        status: { $ne: TICKET_STATUSES.ARCHIVED },
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

    ord = ord + 10;
  }

  if (!bulkOps.length) {
    return '';
  }

  await collection.bulkWrite(bulkOps);
  return 'ok';
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

export const getAmountsMap = async (
  models: IModels,
  user: IUserDocument,
  args: any,
  stage: IStageDocument,
  tickUsed = true,
) => {
  const amountsMap = {};

  const filter = await generateFilter(
    models,
    user._id,
    { ...args, stageId: stage._id, pipelineId: stage.pipelineId },
    args.extraParams,
  );

  const amountList = await models.Tickets.aggregate([
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

export const getItemList = async (
  models: IModels,
  filter: any,
  args: ITicketQueryParams,
  user: IUserDocument,
  getExtraFields?: (item: any) => { [key: string]: any },
) => {
  const { list, pageInfo, totalCount } = await cursorPaginate<ITicketDocument>({
    model: models.Tickets,
    params: args,
    query: filter,
  });

  // const ids = list.map((item) => item._id);

  // const conformities = await sendCoreMessage({
  //   subdomain,
  //   action: 'conformities.getConformities',
  //   data: {
  //     mainType: type,
  //     mainTypeIds: ids,
  //     relTypes: ['company', 'customer'],
  //   },
  //   isRPC: true,
  //   defaultValue: [],
  // });

  const companyIds: string[] = [];
  const customerIds: string[] = [];
  const companyIdsByItemId = {};
  const customerIdsByItemId = {};

  // const perConformity = (
  //   conformity,
  //   cocIdsByItemId,
  //   cocIds,
  //   typeId1,
  //   typeId2,
  // ) => {
  //   cocIds.push(conformity[typeId1]);

  //   if (!cocIdsByItemId[conformity[typeId2]]) {
  //     cocIdsByItemId[conformity[typeId2]] = [];
  //   }

  //   cocIdsByItemId[conformity[typeId2]].push(conformity[typeId1]);
  // };

  // for (const conf of conformities) {
  //   if (conf.mainType === 'company') {
  //     perConformity(
  //       conf,
  //       companyIdsByItemId,
  //       companyIds,
  //       'mainTypeId',
  //       'relTypeId',
  //     );
  //     continue;
  //   }
  //   if (conf.relType === 'company') {
  //     perConformity(
  //       conf,
  //       companyIdsByItemId,
  //       companyIds,
  //       'relTypeId',
  //       'mainTypeId',
  //     );
  //     continue;
  //   }
  //   if (conf.mainType === 'customer') {
  //     perConformity(
  //       conf,
  //       customerIdsByItemId,
  //       customerIds,
  //       'mainTypeId',
  //       'relTypeId',
  //     );
  //     continue;
  //   }
  //   if (conf.relType === 'customer') {
  //     perConformity(
  //       conf,
  //       customerIdsByItemId,
  //       customerIds,
  //       'relTypeId',
  //       'mainTypeId',
  //     );
  //     continue;
  //   }
  // }

  const companies = await sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'companies',
    action: 'findActiveCompanies',
    input: {
      query: {
        _id: { $in: [...new Set(companyIds)] },
      },
      fields: {
        primaryName: 1,
        primaryEmail: 1,
        primaryPhone: 1,
        emails: 1,
        phones: 1,
      },
    },
    defaultValue: [],
  });

  const customers = await sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'customers',
    action: 'findActiveCustomers',
    input: {
      query: {
        _id: { $in: [...new Set(customerIds)] },
      },
      fields: {
        firstName: 1,
        lastName: 1,
        middleName: 1,
        visitorContactInfo: 1,
        primaryEmail: 1,
        primaryPhone: 1,
        emails: 1,
        phones: 1,
      },
    },
    defaultValue: [],
  });

  const getCocsByItemId = (
    itemId: string,
    cocIdsByItemId: any,
    cocs: any[],
  ) => {
    const cocIds = cocIdsByItemId[itemId] || [];

    return cocIds.flatMap((cocId: string) => {
      const found = cocs.find((coc) => cocId === coc._id);

      return found || [];
    });
  };

  const updatedList: any[] = [];

  // const notifications = await sendNotificationsMessage({
  //   subdomain,
  //   action: 'find',
  //   data: {
  //     selector: {
  //       contentTypeId: { $in: ids },
  //       isRead: false,
  //       receiver: user._id
  //     },
  //     fields: { contentTypeId: 1 }
  //   },
  //   isRPC: true,
  //   defaultValue: []
  // });

  const fields = await sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'fields',
    action: 'find',
    input: {
      query: {
        showInCard: true,
        contentType: `sales:deal`,
      },
    },
    defaultValue: [],
  });

  // add just incremented order to each item in list, not from db
  let order = 0;
  for (const item of list as any) {
    if (item.customFieldsData?.length && fields?.length) {
      item.customProperties = [];

      fields.forEach((field) => {
        const fieldData = (item.customFieldsData || []).find(
          (f) => f.field === field._id,
        );

        if (item.customProperties && fieldData) {
          item.customProperties.push({
            name: `${field.text} - ${fieldData.value}`,
          });
        }
      });
    }

    // const notification = notifications.find(n => n.contentTypeId === item._id);

    updatedList.push({
      ...item,
      order: order++,
      isWatched: (item.watchedUserIds || []).includes(user._id),
      // hasNotified: notification ? false : true,
      customers: getCocsByItemId(item._id, customerIdsByItemId, customers),
      companies: getCocsByItemId(item._id, companyIdsByItemId, companies),
      ...(getExtraFields ? await getExtraFields(item) : {}),
    });
  }

  return { list: updatedList, pageInfo, totalCount };
};

export const checkItemPermByUser = async (
  models: IModels,
  user: any,
  item: ITicket,
) => {
  const stage = await models.Stages.getStage(item.stageId);

  const {
    visibility,
    memberIds,
    departmentIds = [],
    branchIds = [],
  } = await models.Pipelines.getPipeline(stage.pipelineId);

  const supervisorDepartments = await sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'departments',
    action: 'findWithChild',
    input: {
      query: {
        supervisorId: user?._id,
      },
      fields: {
        _id: 1,
      },
    },
    defaultValue: [],
  });

  const supervisorDepartmentIds =
    supervisorDepartments?.map((x) => x._id) || [];
  const userDepartmentIds = user?.departmentIds || [];
  const userBranchIds = user?.branchIds || [];

  // check permission on department
  const hasUserInDepartment = compareDepartmentIds(departmentIds, [
    ...userDepartmentIds,
    ...supervisorDepartmentIds,
  ]);
  const isUserInBranch = compareDepartmentIds(branchIds, userBranchIds);

  if (
    visibility === 'private' &&
    !(memberIds || []).includes(user._id) &&
    !hasUserInDepartment &&
    !isUserInBranch &&
    user?.role !== USER_ROLES.SYSTEM
  ) {
    throw new Error('You do not have permission to view.');
  }

  const isSuperVisorInDepartment = compareDepartmentIds(
    departmentIds,
    supervisorDepartmentIds,
  );
  if (isSuperVisorInDepartment) {
    return item;
  }

  // pipeline is Show only the users assigned(created) cards checked
  // and current user nothing dominant users
  // current user hans't this carts assigned and created
  // if (
  //   isCheckUser &&
  //   !(excludeCheckUserIds || []).includes(user?._id) &&
  //   !(
  //     (item.assignedUserIds || []).includes(user?._id) ||
  //     item.userId === user?._id
  //   )
  // ) {
  //   throw new Error('You do not have permission to view.');
  // }

  return item;
};

// comparing pipelines departmentIds and current user departmentIds
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

export const getCloseDateByType = (closeDateType: string) => {
  if (closeDateType === CLOSE_DATE_TYPES.NEXT_DAY) {
    const tommorrow = moment().add(1, 'days');

    return {
      $gte: new Date(tommorrow.startOf('day').toISOString()),
      $lte: new Date(tommorrow.endOf('day').toISOString()),
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
    filter.source = { $eq: source };
  }

  if (userIds) {
    const isEmpty = isListEmpty(userIds);

    filter.userId = isEmpty ? { $in: [null, []] } : { $in: userIds };
  }

  if (priority) {
    filter.priority = { $eq: priority };
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

export const dateSelector = (date: { month: number; year: number }) => {
  const { year, month } = date;

  const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));

  return {
    $gte: start,
    $lte: end,
  };
};

export const generateArhivedItemsFilter = (
  params: IArchiveArgs,
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

  const filter: any = { status: TICKET_STATUSES.ARCHIVED };

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

const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const orderHeler = (aboveOrder, belowOrder) => {
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
      status: { $ne: TICKET_STATUSES.ARCHIVED },
    })
    .sort({ order: 1 })
    .limit(1);

  const belowOrder = belowItems[0]?.order;

  const order = orderHeler(aboveOrder, belowOrder);

  // if duplicated order, then in stages items bulkUpdate 100, 110, 120, 130
  if ([aboveOrder, belowOrder].includes(order)) {
    await bulkUpdateOrders({ collection, stageId });

    return getNewOrder({ collection, stageId, aboveItemId });
  }

  return order;
};

/**
 * Copies pipeline labels alongside ticket when they are moved between different pipelines.
 */
export const copyPipelineLabels = async (
  models: IModels,
  params: {
    item: ITicketDocument;
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

  await models.PipelineLabels.labelsLabel(
    newStage.pipelineId,
    item._id,
    updatedLabelIds,
  );
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

export const ticketResolver = async (
  models: IModels,
  subdomain: string,
  user: any,
  ticket: ITicket,
) => {
  const additionInfo = {};
  const resolver = resolvers['Ticket'] || {};

  for (const subResolver of Object.keys(resolver)) {
    try {
      additionInfo[subResolver] = await resolver[subResolver](
        ticket,
        {},
        { models, subdomain, user },
        { isSubscription: true },
      );
    } catch (unused) {
      continue;
    }
  }

  return additionInfo;
};
