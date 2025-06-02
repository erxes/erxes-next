import { can } from 'erxes-api-shared/core-modules';
import { IUserDocument } from 'erxes-api-shared/core-types';
import {
  checkUserIds,
  getNextMonth,
  getToday,
  regexSearchText,
  sendTRPCMessage,
  USER_ROLES,
  validSearchText,
} from 'erxes-api-shared/utils';
import moment from 'moment';
import { DeleteResult } from 'mongoose';
import * as _ from 'underscore';
import { IModels } from '~/connectionResolvers';
import {
  IArchiveArgs,
  IDeal,
  IDealDocument,
  IDealQueryParams,
  IPipeline,
  IStage,
  IStageDocument,
} from './@types';
import { CLOSE_DATE_TYPES, SALES_STATUSES } from './constants';
import { generateFilter } from './graphql/resolvers/queries/deals';

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

export const watchItem = async (
  collection: any,
  _id: string,
  isAdd: boolean,
  userId: string,
) => {
  const item = await collection.findOne({ _id });

  const watchedUserIds = item.watchedUserIds || [];

  if (isAdd) {
    watchedUserIds.push(userId);
  } else {
    const index = watchedUserIds.indexOf(userId);

    watchedUserIds.splice(index, 1);
  }

  await collection.updateOne({ _id }, { $set: { watchedUserIds } });

  return collection.findOne({ _id });
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

export const fillSearchTextItem = (doc: IDeal, item?: IDealDocument) => {
  const document = item || { name: '', description: '' };
  Object.assign(document, doc);

  return validSearchText([document.name || '', document.description || '']);
};

export const generateBoardNumber = async (models: IModels, doc: IDeal) => {
  const stage = await models.Stages.getStage(doc.stageId);
  const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);

  if (pipeline.numberSize) {
    const { numberSize, numberConfig = '' } = pipeline;

    const number = await boardNumberGenerator(
      models,
      numberConfig,
      numberSize,
      false,
      pipeline.type,
    );

    doc.number = number;
  }

  return { updatedDoc: doc, pipeline };
};

export const createBoardItem = async (models: IModels, doc: IDeal) => {
  const response = await generateBoardNumber(models, doc);

  const { pipeline, updatedDoc } = response;

  let item;

  try {
    item = await models.Deals.create({
      ...updatedDoc,
      stageChangedDate: new Date(),
      searchText: fillSearchTextItem(doc),
    });
  } catch (e) {
    if (e.message.includes(`E11000 duplicate key error`)) {
      console.log(doc.number, doc.stageId);
      await createBoardItem(models, doc);
    } else {
      throw new Error(e.message);
    }
  }

  // update numberConfig of the same configed pipelines
  if (doc.number) {
    await models.Pipelines.updateMany(
      {
        numberConfig: pipeline.numberConfig,
        type: pipeline.type,
      },
      { $set: { lastNum: doc.number } },
    );
  }

  //   let action = 'create';
  //   let content = '';

  //   if (doc.sourceConversationIds && doc.sourceConversationIds.length > 0) {
  //     action = 'convert';
  //     content = item.sourceConversationIds.slice(-1)[0];
  //   }

  //   // create log
  //   await putActivityLog(subdomain, {
  //     action: 'createBoardItem',
  //     data: {
  //       item,
  //       contentType: type,
  //       action,
  //       content,
  //       createdBy: item.userId || '',
  //       contentId: item._id,
  //     },
  //   });

  return item;
};

export const removeStageItems = async (models: IModels, stageId: string) => {
  await removeItems(models, [stageId]);
};

export const removeStageWithItems = async (
  models: IModels,
  pipelineId: string,
  prevItemIds: string[] = [],
): Promise<DeleteResult> => {
  const selector = { pipelineId, _id: { $nin: prevItemIds } };

  const stageIds = await models.Stages.find(selector).distinct('_id');

  await models.Deals.deleteMany({ stageId: { $in: stageIds } });

  return models.Stages.deleteMany(selector);
};

export const removeItems = async (models: IModels, stageIds: string[]) => {
  const items = await models.Deals.find(
    { stageId: { $in: stageIds } },
    { _id: 1 },
  );

  const itemIds = items.map((i) => i._id);

  await models.Checklists.removeChecklists(itemIds);

  //   await sendCoreMessage({
  //     subdomain,
  //     action: "conformities.removeConformities",
  //     data: {
  //       mainType: type,
  //       mainTypeIds: itemIds
  //     }
  //   });

  //   await sendCoreMessage({
  //     subdomain,
  //     action: "removeInternalNotes",
  //     data: { contentType: `sales:${type}`, contentTypeIds: itemIds }
  //   });

  await models.Deals.deleteMany({ stageId: { $in: stageIds } });
};

export const removePipelineStagesWithItems = async (
  models: IModels,
  pipelineId: string,
): Promise<DeleteResult> => {
  const stageIds = await models.Stages.find({ pipelineId })
    .distinct('_id')
    .lean();

  await removeItems(models, stageIds);

  return await models.Stages.deleteMany({ pipelineId });
};

export const generateLastNum = async (models: IModels, doc: IPipeline) => {
  const replacedConfig = await configReplacer(doc.numberConfig);
  const re = replacedConfig + '[0-9]+$';

  const pipeline = await models.Pipelines.findOne({
    lastNum: new RegExp(re),
    type: doc.type,
  });

  if (pipeline) {
    return pipeline.lastNum || '';
  }

  const item = await models.Deals.findOne({
    number: new RegExp(re),
  }).sort({ createdAt: -1 });

  if (item) {
    return item.number;
  }

  // generate new number by new numberConfig
  return await boardNumberGenerator(
    models,
    doc.numberConfig ?? '',
    doc.numberSize ?? '',
    true,
    'lastNum',
  );
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
  // fetch stage from database
  const prevEntries = await models.Stages.find({ _id: { $in: prevItemIds } });
  const prevEntriesIds = prevEntries.map((entry) => entry._id);

  await removeStageWithItems(models, pipelineId, prevItemIds);

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

// Removes all board item related things
export const destroyBoardItemRelations = async (
  models: IModels,
  contentTypeId: string,
) => {
  //   await putActivityLog(subdomain, {
  //     action: 'removeActivityLog',
  //     data: { contentTypeId },
  //   });

  await models.Checklists.removeChecklists([contentTypeId]);

  //   await sendCoreMessage({
  //     subdomain,
  //     action: 'conformities.removeConformity',
  //     data: {
  //       mainType: contentType,
  //       mainTypeId: contentTypeId,
  //     },
  //   });

  //   await sendCoreMessage({
  //     subdomain,
  //     action: 'removeInternalNotes',
  //     data: {
  //       contentType: `sales:${contentType}`,
  //       contentTypeIds: [contentTypeId],
  //     },
  //   });
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

const generateArchivedItemsFilter = (
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

  const filter: any = { status: SALES_STATUSES.ARCHIVED };

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

export const archivedItems = async (
  models: IModels,
  params: IArchiveArgs,
  collection: any,
) => {
  const { pipelineId, ...listArgs } = params;

  const { page = 0, perPage = 0 } = listArgs;

  const stages = await models.Stages.find({ pipelineId }).lean();

  if (stages.length > 0) {
    const filter = generateArchivedItemsFilter(params, stages);

    return collection
      .find(filter)
      .sort({
        modifiedAt: -1,
      })
      .skip(page || 0)
      .limit(perPage || 20)
      .lean();
  }

  return [];
};

export const archivedItemsCount = async (
  models: IModels,
  params: IArchiveArgs,
  collection: any,
) => {
  const { pipelineId } = params;

  const stages = await models.Stages.find({ pipelineId });

  if (stages.length > 0) {
    const filter = generateArchivedItemsFilter(params, stages);

    return collection.find(filter).countDocuments();
  }

  return 0;
};

export const checkItemPermByUser = async (
  models: IModels,
  user: any,
  deal: IDeal,
) => {
  const stage = await models.Stages.getStage(deal.stageId);

  const {
    visibility,
    memberIds,
    departmentIds = [],
    branchIds = [],
    isCheckUser,
    excludeCheckUserIds,
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
  const userDepartmentIds = user.departmentIds || [];
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
    return deal;
  }

  // pipeline is Show only the users assigned(created) cards checked
  // and current user nothing dominant users
  // current user hans't this carts assigned and created
  if (
    isCheckUser &&
    !(excludeCheckUserIds || []).includes(user._id) &&
    !(
      (deal.assignedUserIds || []).includes(user._id) ||
      deal.userId === user._id
    )
  ) {
    throw new Error('You do not have permission to view.');
  }

  return deal;
};

export const getItemList = async (
  models: IModels,
  filter: any,
  args: IDealQueryParams,
  user: IUserDocument,
  type: string,
  extraFields?: { [key: string]: number },
  getExtraFields?: (item: any) => { [key: string]: any },
  serverTiming?,
) => {
  const { page, perPage, sortField, sortDirection } = args;

  let limit = args.limit !== undefined ? args.limit : 10;

  let sort: any = { order: 1, createdAt: -1 };

  if (sortField && sortDirection) {
    sort = { [sortField]: sortDirection, order: 1, createdAt: -1 };
  }

  const pipelines: any[] = [
    {
      $match: filter,
    },
    {
      $sort: sort,
    },
    {
      $skip: args.skip || 0,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'assignedUserIds',
        foreignField: '_id',
        as: 'users_doc',
      },
    },
    {
      $lookup: {
        from: 'sales_stages',
        localField: 'stageId',
        foreignField: '_id',
        as: 'stages_doc',
      },
    },
    {
      $lookup: {
        from: 'sales_pipeline_labels',
        localField: 'labelIds',
        foreignField: '_id',
        as: 'labels_doc',
      },
    },
    {
      $project: {
        assignedUsers: '$users_doc',
        labels: '$labels_doc',
        stage: { $arrayElemAt: ['$stages_doc', 0] },
        name: 1,
        isComplete: 1,
        startDate: 1,
        closeDate: 1,
        relations: 1,
        createdAt: 1,
        modifiedAt: 1,
        priority: 1,
        number: 1,
        watchedUserIds: 1,
        customFieldsData: 1,
        stageChangedDate: 1,
        tagIds: 1,
        status: 1,
        branchIds: 1,
        departmentIds: 1,
        userId: 1,
        ...(extraFields || {}),
      },
    },
  ];

  if (page && perPage) {
    pipelines[2] = {
      $skip: (page - 1) * perPage,
    };
    limit = perPage;
  }

  if (limit > 0) {
    pipelines.splice(3, 0, { $limit: limit });
  }

  if (serverTiming) {
    serverTiming.startTime('getItemsPipelineAggregate');
  }

  const list = await models.Deals.aggregate(pipelines);

  if (serverTiming) {
    serverTiming.endTime('getItemsPipelineAggregate');
  }

  // const ids = list.map((item) => item._id);

  if (serverTiming) {
    serverTiming.startTime('conformities');
  }

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

  if (serverTiming) {
    serverTiming.endTime('conformities');
  }

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

  if (serverTiming) {
    serverTiming.startTime('getItemsCompanies');
  }

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

  if (serverTiming) {
    serverTiming.endTime('getItemsCompanies');
  }

  if (serverTiming) {
    serverTiming.startTime('getItemsCustomers');
  }

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

  if (serverTiming) {
    serverTiming.endTime('getItemsCustomers');
  }

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

  if (serverTiming) {
    serverTiming.startTime('getItemsNotifications');
  }

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

  if (serverTiming) {
    serverTiming.endTime('getItemsNotifications');
  }

  if (serverTiming) {
    serverTiming.startTime('getItemsFields');
  }

  const fields = await sendTRPCMessage({
    pluginName: 'core',
    method: 'query',
    module: 'fields',
    action: 'find',
    input: {
      query: {
        showInCard: true,
        contentType: `sales:${type}`,
      },
    },
    defaultValue: [],
  });

  if (serverTiming) {
    serverTiming.endTime('getItemsFields');
  }

  // add just incremented order to each item in list, not from db
  let order = 0;
  for (const item of list) {
    if (
      item.customFieldsData &&
      item.customFieldsData.length > 0 &&
      fields.length > 0
    ) {
      item.customProperties = [];

      fields.forEach((field) => {
        const fieldData = item.customFieldsData.find(
          (f) => f.field === field._id,
        );

        if (fieldData) {
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

  return updatedList;
};

// comparing pipelines departmentIds and current user departmentIds
const compareDepartmentIds = (
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

export const generateAmounts = (productsData, useTick = true) => {
  const amountsMap = {};

  (productsData || []).forEach((product) => {
    // Tick paid or used is false then exclude
    if (useTick && !product.tickUsed) {
      return;
    }

    if (!useTick && product.tickUsed) {
      return;
    }

    const type = product.currency;

    if (type) {
      if (!amountsMap[type]) {
        amountsMap[type] = 0;
      }

      amountsMap[type] += product.amount || 0;
    }
  });

  return amountsMap;
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
        status: { $ne: SALES_STATUSES.ARCHIVED },
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
      status: { $ne: SALES_STATUSES.ARCHIVED },
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

export const itemsEdit = async (
  models: IModels,
  _id: string,
  type: string,
  oldItem: any,
  doc: any,
  proccessId: string,
  user: IUserDocument,
  modelUpate,
) => {
  const extendedDoc = {
    ...doc,
    modifiedAt: new Date(),
    modifiedBy: user._id,
  };

  const stage = await models.Stages.getStage(oldItem.stageId);

  const { canEditMemberIds } = stage;

  if (
    canEditMemberIds &&
    canEditMemberIds.length > 0 &&
    !canEditMemberIds.includes(user._id)
  ) {
    throw new Error('Permission denied');
  }

  if (
    doc.status === 'archived' &&
    oldItem.status === 'active' &&
    !(await can('dealsArchive', user))
  ) {
    throw new Error('Permission denied');
  }

  if (extendedDoc.customFieldsData) {
    // clean custom field values
    extendedDoc.customFieldsData = await sendTRPCMessage({
      pluginName: 'core',
      method: 'mutation',
      module: 'fields',
      action: 'prepareCustomFieldsData',
      input: {
        customFieldsData: extendedDoc.customFieldsData,
      },
      defaultValue: [],
    });
  }

  const updatedItem = await modelUpate(_id, extendedDoc);
  // labels should be copied to newly moved pipeline
  if (doc.stageId) {
    await copyPipelineLabels(models, { item: oldItem, doc, user });
  }

  // const notificationDoc: IBoardNotificationParams = {
  const notificationDoc: any = {
    item: updatedItem,
    user,
    type: `${type}Edit`,
    contentType: type,
  };

  if (doc.status && oldItem.status && oldItem.status !== doc.status) {
    const activityAction = doc.status === 'active' ? 'activated' : 'archived';

    // putActivityLog(subdomain, {
    //   action: "createArchiveLog",
    //   data: {
    //     item: updatedItem,
    //     contentType: type,
    //     action: "archive",
    //     userId: user._id,
    //     createdBy: user._id,
    //     contentId: updatedItem._id,
    //     content: activityAction,
    //   },
    // });

    // order notification
    await changeItemStatus(models, user, {
      item: updatedItem,
      status: activityAction,
      proccessId,
      stage,
    });
  }

  if (doc.assignedUserIds) {
    const { addedUserIds, removedUserIds } = checkUserIds(
      oldItem.assignedUserIds,
      doc.assignedUserIds,
    );

    // const activityContent = { addedUserIds, removedUserIds };

    // putActivityLog(subdomain, {
    //   action: "createAssigneLog",
    //   data: {
    //     contentId: _id,
    //     userId: user._id,
    //     contentType: type,
    //     content: activityContent,
    //     action: "assignee",
    //     createdBy: user._id,
    //   },
    // });

    notificationDoc.invitedUsers = addedUserIds;
    notificationDoc.removedUsers = removedUserIds;
  }

  // await sendNotifications(models, subdomain, notificationDoc);

  if (!notificationDoc.invitedUsers && !notificationDoc.removedUsers) {
    // sendCoreMessage({
    //   subdomain: "os",
    //   action: "sendMobileNotification",
    //   data: {
    //     title: notificationDoc?.item?.name,
    //     body: `${user?.details?.fullName || user?.details?.shortName
    //       } has updated`,
    //     receivers: notificationDoc?.item?.assignedUserIds,
    //     data: {
    //       type,
    //       id: _id,
    //     },
    //   },
    // });
  }

  // exclude [null]
  if (doc.tagIds && doc.tagIds.length) {
    doc.tagIds = doc.tagIds.filter((ti) => ti);
  }

  // putUpdateLog(
  //   models,
  //   subdomain,
  //   {
  //     type,
  //     object: oldItem,
  //     newData: extendedDoc,
  //     updatedDocument: updatedItem,
  //   },
  //   user
  // );

  // const updatedStage = await models.Stages.getStage(updatedItem.stageId);

  // if (doc.tagIds || doc.startDate || doc.closeDate || doc.name) {
  //   graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
  //     salesPipelinesChanged: {
  //       _id: stage.pipelineId,
  //     },
  //   });
  // }

  // if (updatedStage.pipelineId !== stage.pipelineId) {
  //   graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
  //     salesPipelinesChanged: {
  //       _id: stage.pipelineId,
  //       proccessId,
  //       action: "itemRemove",
  //       data: {
  //         item: oldItem,
  //         oldStageId: stage._id,
  //       },
  //     },
  //   });
  //   graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
  //     salesPipelinesChanged: {
  //       _id: updatedStage.pipelineId,
  //       proccessId,
  //       action: "itemAdd",
  //       data: {
  //         item: {
  //           ...updatedItem._doc,
  //           ...(await itemResolver(models, subdomain, user, type, updatedItem)),
  //         },
  //         aboveItemId: "",
  //         destinationStageId: updatedStage._id,
  //       },
  //     },
  //   });
  // } else {
  //   graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
  //     salesPipelinesChanged: {
  //       _id: stage.pipelineId,
  //       proccessId,
  //       action: "itemUpdate",
  //       data: {
  //         item: {
  //           ...updatedItem._doc,
  //           ...(await itemResolver(models, subdomain, user, type, updatedItem)),
  //         },
  //       },
  //     },
  //   });
  // }

  // await doScoreCampaign(subdomain, models, _id, updatedItem);

  if (oldItem.stageId === updatedItem.stageId) {
    return updatedItem;
  }

  // if task moves between stages
  // const { content, action } = await itemMover(
  //   models,
  //   user._id,
  //   oldItem,
  //   updatedItem.stageId
  // );

  // await sendNotifications(models, subdomain, {
  //   item: updatedItem,
  //   user,
  //   type: `${type}Change`,
  //   content,
  //   action,
  //   contentType: type,
  // });

  return updatedItem;
};

export const itemMover = async (
  models: IModels,
  userId: string,
  item: IDealDocument,
  destinationStageId: string,
) => {
  const oldStageId = item.stageId;

  let action = `changed order of your deal:`;
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

    // const link = `/${contentType}/board?id=${board._id}&pipelineId=${pipeline._id}&itemId=${item._id}`;

    // const activityLogContent = {
    //   oldStageId,
    //   destinationStageId,
    //   text: `${oldStage.name} to ${stage.name}`,
    // };

    // await putActivityLog(subdomain, {
    //   action: "createBoardItemMovementLog",
    //   data: {
    //     item,
    //     contentType,
    //     userId,
    //     activityLogContent,
    //     link,
    //     action: "moved",
    //     contentId: item._id,
    //     createdBy: userId,
    //     content: activityLogContent,
    //   },
    // });

    // sendNotificationsMessage({
    //   subdomain,
    //   action: "batchUpdate",
    //   data: {
    //     selector: { contentType, contentTypeId: item._id },
    //     modifier: { $set: { link } },
    //   },
    // });
  }

  return { content, action };
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
    // graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
    //   salesPipelinesChanged: {
    //     _id: stage.pipelineId,
    //     proccessId,
    //     action: "itemRemove",
    //     data: {
    //       item,
    //       oldStageId: item.stageId,
    //     },
    //   },
    // });

    return;
  }

  const aboveItems = await models.Deals.find({
    stageId: item.stageId,
    status: { $ne: SALES_STATUSES.ARCHIVED },
    order: { $lt: item.order },
  })
    .sort({ order: -1 })
    .limit(1);

  const aboveItemId = aboveItems[0]?._id || '';

  // maybe, recovered order includes to oldOrders
  await models.Deals.updateOne(
    {
      _id: item._id,
    },
    {
      order: await getNewOrder({
        collection: models.Deals,
        stageId: item.stageId,
        aboveItemId,
      }),
    },
  );

  // graphqlPubsub.publish(`salesPipelinesChanged:${stage.pipelineId}`, {
  //   salesPipelinesChanged: {
  //     _id: stage.pipelineId,
  //     proccessId,
  //     action: "itemAdd",
  //     data: {
  //       item: {
  //         ...item._doc,
  //         ...(await itemResolver(models, subdomain, user, type, item)),
  //       },
  //       aboveItemId,
  //       destinationStageId: item.stageId,
  //     },
  //   },
  // });
};

/**
 * Copies pipeline labels alongside deal when they are moved between different pipelines.
 */
export const copyPipelineLabels = async (
  models: IModels,
  params: {
    item: IDealDocument;
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

/**
 * Copies checklists of board item
 */
export const copyChecklists = async (
  models: IModels,
  params: {
    contentType: string;
    contentTypeId: string;
    targetContentId: string;
    user: IUserDocument;
  },
) => {
  const { contentType, contentTypeId, targetContentId, user } = params;

  const originalChecklists = await models.Checklists.find({
    contentType,
    contentTypeId,
  }).lean();

  const clonedChecklists = await models.Checklists.insertMany(
    originalChecklists.map((originalChecklist) => ({
      contentType,
      contentTypeId: targetContentId,
      title: originalChecklist.title,
      createdUserId: user._id,
      createdDate: new Date(),
    })),
    { ordered: true },
  );

  const originalChecklistIdToClonedId = new Map<string, string>();

  for (let i = 0; i < originalChecklists.length; i++) {
    originalChecklistIdToClonedId.set(
      originalChecklists[i]._id,
      clonedChecklists[i]._id,
    );
  }

  const originalChecklistItems = await models.ChecklistItems.find({
    checklistId: { $in: originalChecklists.map((x) => x._id) },
  }).lean();

  await models.ChecklistItems.insertMany(
    originalChecklistItems.map(({ content, order, checklistId }) => ({
      checklistId: originalChecklistIdToClonedId.get(checklistId),
      isChecked: false,
      createdUserId: user._id,
      createdDate: new Date(),
      content,
      order,
    })),
    { ordered: false },
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
