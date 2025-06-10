import { IListParams, IUserDocument } from "erxes-api-shared/core-types";
import resolvers from "~/apollo/resolvers";
import { generateModels, IModels } from "~/connectionResolvers";
import { IStage, IStageDocument } from "./@types/stage";
import { ITask, ITaskDocument } from "./@types/task";
import { sendTRPCMessage } from "erxes-api-shared/utils/trpc";
import { BOARD_STATUSES, BOARD_TYPES, CLOSE_DATE_TYPES, MODULE_NAMES } from "./constants";
import moment from "moment";
import { checkUserIds, getNextMonth, getToday, regexSearchText, validSearchText } from "erxes-api-shared/utils/utils";
import { USER_ROLES } from "erxes-api-shared/core-modules/users/constants";
import { IItemCommonFields } from "./@types/common";
import { DeleteResult, models } from "mongoose";
import { type } from "node:os";

interface ISetOrderParam {
  collection: any;
  stageId: string;
  aboveItemId?: string;
}

export interface IArchiveArgs {
  pipelineId: string;
  search: string;
  page?: number;
  perPage?: number;
  userIds?: string[];
  priorities?: string[];
  assignedUserIds?: string[];
  labelIds?: string[];
  productIds?: string[];
  companyIds?: string[];
  customerIds?: string[];
  startDate?: string;
  endDate?: string;
  sources?: string[];
  hackStages?: string[];
}

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
        status: { $ne: BOARD_STATUSES.ARCHIVED },
        ...additionFilter,
      },
      { _id: 1, order: 1 }
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
}: ISetOrderParam) => {
  const aboveItem = await collection.findOne({ _id: aboveItemId });

  const aboveOrder = aboveItem?.order || 0;

  const belowItems = await collection
    .find({
      stageId,
      order: { $gt: aboveOrder },
      status: { $ne: BOARD_STATUSES.ARCHIVED },
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

export const watchItem = async (
  collection: any,
  _id: string,
  isAdd: boolean,
  userId: string
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

export const fillSearchTextItem = (
  doc: IItemCommonFields,
  item?: IItemCommonFields
) => {
  const document = item || { name: '', description: '' };
  Object.assign(document, doc);

  return validSearchText([document.name || '', document.description || '']);
};

export const getCollection = (models: IModels, type: string) => {
  let collection;
  let create;
  let update;
  let remove;

  const { Tasks } = models;

  switch (type) {
    case BOARD_TYPES.TICKET: {
      collection = Tasks;
      create = Tasks.createTask;
      update = Tasks.updateTask;
      remove = Tasks.removeTasks;
      break;
    }

    default:
      break;
  }

  return { collection, create, update, remove };
};

export const getItem = async (models: IModels, type: string, doc: any) => {
  const item = await getCollection(models, type).collection.findOne({ ...doc });

  if (!item) {
    throw new Error(`${type} not found`);
  }

  return item;
};

export const getCompanyIds = async (
  subdomain: string,
  mainType: string,
  mainTypeId: string
): Promise<string[]> => {
  const conformities = await sendTRPCMessage({
    pluginName: 'find conformities',
    method: 'query',
    module: 'conformities',
    action: 'conformities.findConformities',
    input: {
      mainType,
      mainTypeId,
      relType: 'company',
    },
    defaultValue: [],
  });

  return conformities.map(c => c.relTypeId);
};

export const getCustomerIds = async (
  subdomain: string,
  mainType: string,
  mainTypeId: string
): Promise<string[]> => {
  const conformities = await sendTRPCMessage({
    pluginName: 'find conformities', 
    method: 'query',
    module: 'conformities',
    action: 'findConformities',
    input: {
      mainType,
      mainTypeId,
      relType: 'customer',
    },
    defaultValue: [],
  });

  return conformities.map(c => c.relTypeId);
};

// export const getInternalNoteIds = async (
//   subdomain: string,
//   contentType: string,
//   contentTypeId: string
// ): Promise<string[]> => {
//   const internalNotes = await sendInternalNotesMessage({
//     subdomain,
//     action: 'findInternalNotes',
//     data: {
//       contentType,
//       contentTypeId,
//     },
//     isRPC: true,
//     defaultValue: [],
//   });

//   return internalNotes;
// };



// Removes all board item related things
export const destroyBoardItemRelations = async (
  models: IModels,
  contentTypeId: string,
  contentType: string
) => {
  // await putActivityLog(subdomain, {
  //   action: 'removeActivityLog',
  //   data: { contentTypeId },
  // });

  await models.Checklists.removeChecklists(contentType, [contentTypeId]);

  await sendTRPCMessage({
    pluginName:'remove conformity',
    method: 'mutation',
    module: 'conformities',
    action: 'removeConformity',
    input: {
      mainType: contentType,
      mainTypeId: contentTypeId,
    },
    defaultValue:[],
  });

  // await sendInternalNotesMessage({
  //   subdomain,
  //   action: 'removeInternalNotes',
  //   data: {
  //     contentType: `tasks:${contentType}`,
  //     contentTypeIds: [contentTypeId],
  //   },
  // });
};

export const removeItems = async (models: IModels, stageIds: string[]) => {
  const items = await models.Deals.find(
    { stageId: { $in: stageIds } },
    { _id: 1 },
  );

  const itemIds = items.map((i) => i._id);

  await models.Checklists.removeChecklists(itemIds,[]);

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



// Get board item link
export const getBoardItemLink = async (
  models: IModels,
  stageId: string,
  itemId: string
) => {
  const stage = await models.Stages.getStage(stageId);
  const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);
  const board = await models.Boards.getBoard(pipeline.boardId);

  return `/${stage.type}/board?id=${board._id}&pipelineId=${pipeline._id}&itemId=${itemId}`;
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
  type?: string
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

export const generateBoardNumber = async (
  models: IModels,
  doc: IItemCommonFields
) => {
  const stage = await models.Stages.getStage(doc.stageId);
  const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);

  if (pipeline.numberSize) {
    const { numberSize, numberConfig = '' } = pipeline;

    const number = await boardNumberGenerator(
      models,
      numberConfig,
      numberSize,
      false,
      pipeline.type
    );

    doc.number = number;
  }

  return { updatedDoc: doc, pipeline };
};

export const createBoardItem = async (
  models: IModels,
  subdomain: string,
  doc: IItemCommonFields,
  type: string
) => {
  const { collection } = await getCollection(models, type);

  const response = await generateBoardNumber(models, doc);

  const { pipeline, updatedDoc } = response;

  let item;

  try {
    item = await collection.create({
      ...updatedDoc,
      createdAt: new Date(),
      modifiedAt: new Date(),
      stageChangedDate: new Date(),
      searchText: fillSearchTextItem(doc),
    });
  } catch (e) {
    if (e.message.includes(`E11000 duplicate key error`)) {
      await createBoardItem(models, subdomain, doc, type);
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
      { $set: { lastNum: doc.number } }
    );
  }

  let action = 'create';
  let content = '';

  if (doc.sourceConversationIds && doc.sourceConversationIds.length > 0) {
    action = 'convert';
    content = item.sourceConversationIds.slice(-1)[0];
  }

  // // create log
  // await putActivityLog(subdomain, {
  //   action: 'createBoardItem',
  //   data: {
  //     item,
  //     contentType: type,
  //     action,
  //     content,
  //     createdBy: item.userId || '',
  //     contentId: item._id,
  //   },
  // });

  return item;
};

// check booking convert
const checkBookingConvert = async (subdomain: string, productId: string) => {
  const product = await sendTRPCMessage({
    pluginName: 'find one',
    method: 'query',
    module: 'products',
    action: 'products.findOne',
    input: { _id: productId },
    defaultValue:[],
    
  });

  let dealUOM = await sendTRPCMessage({
    pluginName: 'get values',
    method: 'query',
    module: 'configs',
    action: 'getValues',
    input: {
      code: 'dealUOM',
    },
    defaultValue: [],
  });

  let dealCurrency = await sendTRPCMessage({
    pluginName: 'get values',
    method: 'query',
    module:'configs',
    action: 'getValues',
    input: {
      code: 'dealCurrency',
    },

    defaultValue: [],
  });

  if (dealUOM.length > 0) {
    dealUOM = dealUOM[0];
  } else {
    throw new Error('Please choose UNIT OF MEASUREMENT from general settings!');
  }

  if (dealCurrency.length > 0) {
    dealCurrency = dealCurrency[0];
  } else {
    throw new Error('Please choose currency from general settings!');
  }

  return {
    product,
    dealUOM,
    dealCurrency,
  };
};

export const conversationConvertToCard = async (
  models: IModels,
  args
) => {
  const {
    _id,
    type,
    itemId,
    itemName,
    stageId,
    conversation,
    user,
  } = args;

  const { collection, create, update } = getCollection(models, type);

  if (itemId) {
    const oldItem = await collection.findOne({ _id: itemId }).lean();

    const doc = { ...oldItem, ...args };

    if (conversation.assignedUserId) {
      const assignedUserIds = oldItem.assignedUserIds || [];
      assignedUserIds.push(conversation.assignedUserId);

      doc.assignedUserIds = [
        ...new Set([...assignedUserIds, ...args.assignedUserIds]),
      ];
    }

    const sourceConversationIds: string[] = oldItem.sourceConversationIds || [];

    sourceConversationIds.push(conversation._id);

    doc.sourceConversationIds = sourceConversationIds;

    delete doc._id;
    const item = await update(oldItem._id, doc);

    item.userId = user._id;

    // await putActivityLog(subdomain, {
    //   action: 'createBoardItem',
    //   data: {
    //     item,
    //     contentType: type,
    //     action: 'convert',
    //     content: conversation._id,
    //     createdBy: item.userId || '',
    //     contentId: item._id,
    //   },
    // });

    const relTypeIds: string[] = [];

    sourceConversationIds.forEach(async conversationId => {
      // const con = await sendInboxMessage({
      //   subdomain,
      //   action: 'getConversation',
      //   data: {
      //     conversationId,
      //   },
      //   isRPC: true,
      //   defaultValue: {},
      // });

      // if (con.customerId) {
      //   relTypeIds.push(con.customerId);
      // }
    });

    if (conversation.customerId) {
      await sendTRPCMessage({
        pluginName: 'add Conformity',
        method: 'mutation',
        module: 'conformities',
        action: 'conformities.addConformity',
        input: {
          mainType: type,
          mainTypeId: item._id,
          relType: 'customer',
          relTypeId: conversation.customerId,
        },
        defaultValue:[],
      });
    }

    return item._id;
  } else {
    const doc: any = { ...args };

    doc.name = itemName;
    doc.stageId = stageId;
    doc.sourceConversationIds = [_id];
    doc.customerIds = [conversation.customerId];

    const item = await itemsAdd(models, doc, type, create, user);

    return item._id;
  }
};

export const updateName = async (
  subdomain: string,
  type: string,
  itemId: string
) => {
  const validTypes = ['deal', 'ticket', 'purchase', 'task'];

  if (!validTypes.includes(type)) {
    return;
  }

  const models = await generateModels(subdomain);

  const { collection } = getCollection(models, type);
}

  if (itemId) {
    const item = await collection.findOne({ _id: itemId }).lean();
    const stage = await models.Stages.findOne({ _id: item.stageId });
    const pipeline = await models.Pipelines.findOne({ _id: stage?.pipelineId });
    let replacedName = pipeline?.nameConfig;

    if (pipeline?.nameConfig) {
      const regex = /\{(\b\w+\.\b\w+)}/g;
      const matches = pipeline?.nameConfig?.match(regex) || [];

      let array: string[] = [];

      for (const x of matches) {
        const pattern = x.replace('{', '').replace('}', '').split('.');
        const serviceName = pattern[0];
        array.push(serviceName);
      }
      const uniqueServices = [...new Set(array)];

      const idsCustomers = await getCustomerIds(type, item._id);
      const idsCompanies = await getCompanyIds( type, item._id);

      const customers = await sendTRPCMessage({
        pluginName: 'contacts',
        method: 'query',
        module: 'customers',
        action: 'find',
        input: {
          _id: { $in: idsCustomers },
        },
        defaultValue: [],
      });
      
      const companies = await sendTRPCMessage({
        pluginName: 'contacts',
        method: 'query',
        module: 'companies',
        action: 'find',
        input: {
          _id: { $in: idsCompanies },
        },
        defaultValue: [],
      });
      
      const enabledServices = await getServices();
      
      for (const serviceName of uniqueServices) {
        const regex = new RegExp(`\\{\\b${serviceName}\\b.*?\\}`, 'g');
        const matches = pipeline?.nameConfig?.match(regex) || [];
      
        for (const match of matches) {
          const pattern = match.replace('{', '').replace('}', '').split('.');
      
          if (pattern.length > 1 || customers.length > 0 || companies.length > 0) {
            if (serviceName === 'customer') {
              switch (pattern[1]) {
                case 'firstName':
                  replacedName = replacedName?.replace(match, customers[0]?.firstName || '');
                  break;
                case 'lastName':
                  replacedName = replacedName?.replace(match, customers[0]?.lastName || '');
                  break;
                case 'email':
                  replacedName = replacedName?.replace(match, customers[0]?.primaryEmail || '');
                  break;
                case 'phone':
                  replacedName = replacedName?.replace(match, customers[0]?.primaryPhone || '');
                  break;
                case 'count':
                  replacedName = replacedName?.replace(match, customers.length || 0);
                  break;
                default:
                  replacedName = replacedName?.replace(match, '');
                  break;
              }
            }
            if (serviceName === 'company') {
              if (pattern[1] === 'name') {
                replacedName = replacedName?.replace(match, companies[0]?.primaryName || '');
              } else if (pattern[1] === 'count') {
                replacedName = replacedName?.replace(match, companies?.length || 0);
              }
            }
            if (enabledServices.includes(serviceName)) {
              try {
                const result = await sendTRPCMessage({
                  pluginName: serviceName,
                  method: 'mutation',
                  module: 'cards',
                  action: 'updateCardsName',
                  data: {
                    match: match,
                    itemId: itemId,
                    type: type,
                  },
                  defaultValue: '',
                  options: { timeout: 50000 }
                });
      
                replacedName = replacedName?.replace(match, result || '');
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      }
    } 
  }



await collection.updateOne(
        { _id: item._id },
        { $set: { name: replacedName } }
);

export const checkItemPermByUser = async (
  subdomain: string,
  models: IModels,
  user: any,
  item: IItemCommonFields
) => {
  const stage = await models.Stages.getStage(item.stageId);

  const {
    visibility,
    memberIds,
    departmentIds = [],
    branchIds = [],
    isCheckUser,
    excludeCheckUserIds
  } = await models.Pipelines.getPipeline(stage.pipelineId);

  const supervisorDepartments =
    (await sendTRPCMessage({
      pluginName:'find with child',
      method: 'query',
      module: 'departments',
      action: 'departments.findWithChild',
      input: {
        query: {
          supervisorId: user?._id
        },
        fields: {
          _id: 1
        }
      },
      defaultValue:[],
     
    })) || [];

  const supervisorDepartmentIds = supervisorDepartments?.map(x => x._id) || [];
  const userDepartmentIds = user.departmentIds || [];
  const userBranchIds = user?.branchIds || [];

  // check permission on department
  const hasUserInDepartment = compareDepartmentIds(departmentIds, [
    ...userDepartmentIds,
    ...supervisorDepartmentIds
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
    supervisorDepartmentIds
  );
  if (isSuperVisorInDepartment) {
    return item;
  }

  // pipeline is Show only the users assigned(created) cards checked
  // and current user nothing dominant users
  // current user hans't this carts assigned and created
  if (
    isCheckUser &&
    !(excludeCheckUserIds || []).includes(user._id) &&
    !(
      (item.assignedUserIds || []).includes(user._id) ||
      item.userId === user._id
    )
  ) {
    throw new Error('You do not have permission to view.');
  }

  return checkItemPermByUser(models,user,item);
};


export const configReplacer = config => {
  const now = new Date();

  // replace type of date
  return config
    .replace(/\{year}/g, now.getFullYear().toString())
    .replace(/\{month}/g, `0${(now.getMonth() + 1).toString()}`.slice(-2))
    .replace(/\{day}/g, `0${now.getDate().toString()}`.slice(-2));
};

export const collectItems = async (
  models: IModels,
  { contentType, contentId }
) => {
  let tasks: any[] = [];

  if (contentType === "activity") {
    return;
  }

  return tasks;
};

export const generateConditionStageIds = async (
  models: IModels,
  {
    boardId,
    pipelineId,
    options
  }: {
    boardId?: string;
    pipelineId?: string;
    options?: any;
  }
) => {
  let pipelineIds: string[] = [];

  if (options && options.pipelineId) {
    pipelineIds = [options.pipelineId];
  }

  if (boardId && (!options || !options.pipelineId)) {
    const board = await models.Boards.getBoard(boardId);

    const pipelines = await models.Pipelines.find(
      {
        _id: {
          $in: pipelineId ? [pipelineId] : board.pipelines || []
        }
      },
      { _id: 1 }
    );

    pipelineIds = pipelines.map(p => p._id);
  }

  const stages = await models.Stages.find(
    { pipelineId: pipelineIds },
    { _id: 1 }
  );

  return stages.map(s => s._id);
};

export const getContentItem = async (subdomain, data) => {
  const models = await generateModels(subdomain);

  const { Stages, Tasks } = models;
  const { action, content, contentType, contentId } = data;

  const type =
    contentType && typeof contentType === "string"
      ? contentType.split(":")[1]
      : "";

  if (action === "moved") {
    let item = {};

    switch (type) {
      case "task":
        item = await Tasks.getTask(contentId);
      default:
        break;
    }

    const { oldStageId, destinationStageId } = content;

    const destinationStage = await Stages.findOne({
      _id: destinationStageId
    }).lean();
    const oldStage = await Stages.findOne({ _id: oldStageId }).lean();

    if (destinationStage && oldStage) {
      return {
        destinationStage: destinationStage.name,
        oldStage: oldStage.name,
        item
      };
    }

    return {
      text: content.text
    };
  }

  if (action === "moved") {
    let item = {};

    switch (type) {
      case "task":
        item = await Tasks.getTask(contentId);
      default:
        break;
    }

    const { oldStageId, destinationStageId } = content;

    const destinationStage = await Stages.findOne({
      _id: destinationStageId
    }).lean();
    const oldStage = await Stages.findOne({ _id: oldStageId }).lean();

    if (destinationStage && oldStage) {
      return {
        destinationStage: destinationStage.name,
        oldStage: oldStage.name,
        item
      };
    }

    return {
      text: content.text
    };
  }

  if (action === "assignee") {
    let addedUsers: IUserDocument[] = [];
    let removedUsers: IUserDocument[] = [];

    if (content) {
      addedUsers = await sendTRPCMessage({
        pluginName:'find',
        method: 'query',
        module: 'users',
        action: "find",
        input: {
          query: {
            _id: { $in: content.addedUserIds }
          }
        },
        defaultValue: [],
      });

      removedUsers = await sendTRPCMessage({
        pluginName: 'find',
        method: 'query',
        module: 'users',
        action: "find",
        input: {
          query: {
            _id: { $in: content.removedUserIds }
          }
        },
        defaultValue: [],
      });
    }

    return { addedUsers, removedUsers };
  }
};

// export const getContentTypeDetail = async (subdomain, data) => {
//   const models = await generateModels(subdomain);

//   const { ChecklistItems, Checklists, Tasks } = models;
//   const { contentType = "", contentId, content } = data;

//   let item = {};

//   try {
//     switch (contentType.split(":")[1]) {
//       case "checklist":
//         item = (await Checklists.findOne({ _id: content._id })) || {};
//         break;
//       case "checklistitem":
//         item = (await ChecklistItems.findOne({ _id: content._id })) || {};
//         break;
//       case "task":
//         item = await Tasks.getTask(contentId);
//         break;
//     }
//   } catch (e) {
//     debugError(e.message);

//     return e.message;
//   }

//   return item;
// };

// contentType should come with "tasks:deal|task" format

export const getCardContentIds = async (
  models: IModels,
  { pipelineId, contentType }
) => {
  const type =
    contentType.indexOf(":") !== -1 ? contentType.split(":")[1] : contentType;
  const stageIds = await models.Stages.find({ pipelineId }).distinct("_id");
  const { collection } = getCollection(models, type);

  return collection.find({ stageId: { $in: stageIds } }).distinct("_id");
};

export const getCardItem = async (
  models: IModels,
  { contentTypeId, contentType }
) => {
  const { Tasks } = models;
  const filter = { _id: contentTypeId };

  let item;

  switch (contentType) {
    case MODULE_NAMES.TICKET:
      item = await Tasks.findOne(filter);
      break;
    default:
      break;
  }

  return item;
};

export const getBoardsAndPipelines = doc => {
  const { config } = doc;

  if (!config || !config.boardsPipelines) {
    return doc;
  }

  const boardIds: string[] = [];
  const pipelineIds: string[] = [];

  const boardsPipelines = config.boardsPipelines || [];

  for (const item of boardsPipelines) {
    boardIds.push(item.boardId || "");

    const pipelines = item.pipelineIds || [];

    for (const pipelineId of pipelines) {
      pipelineIds.push(pipelineId);
    }
  }

  config.boardIds = boardIds;
  config.pipelineIds = pipelineIds;

  doc.config = config;

  return doc;
};

// export const generateSystemFields = ({ data: { groupId, type } }) => {
//   const fields: any = [];

//   CARD_PROPERTIES_INFO.ALL.map(e => {
//     fields.push({
//       text: e.label,
//       type: e.type,
//       field: e.field,
//       canHide: e.canHide,
//       validation: e.validation,
//       groupId,
//       options: e.options,
//       contentType: `tasks:${type}`,
//       isDefinedByErxes: true
//     });
//   });

//   return fields;
// };



export const itemResolver = async (
  models: IModels,
  user: any,
  type: string,
  item: IItemCommonFields
) => {
  let resolverType = "";

  switch (type) {
    case "task":
      resolverType = "Task";
      break;
  }

  const additionInfo = {};
  const resolver = resolvers[resolverType] || {};

  for (const subResolver of Object.keys(resolver)) {
    try {
      additionInfo[subResolver] = await resolver[subResolver](
        item,
        {},
        { models, user },
        { isSubscription: true }
      );
    } catch (unused) {
      continue;
    }
  }

  return additionInfo;
};

export const itemsAdd = async (
  models: IModels,
  doc: (IItemCommonFields | IItemCommonFields) & {
    proccessId: string;
    aboveItemId: string;
  },
  type: string,
  createModel: any,
  user?: IUserDocument,
  docModifier?: any
) => {
  const { collection } = getCollection(models, type);

  doc.initialStageId = doc.stageId;
  doc.watchedUserIds = user && [user._id];

  const modifiedDoc = docModifier ? docModifier(doc) : doc;

  const extendedDoc = {
    ...modifiedDoc,
    modifiedBy: user && user._id,
    userId: user ? user._id : doc.userId,
    order: await getNewOrder({
      collection,
      stageId: doc.stageId,
      aboveItemId: doc.aboveItemId
    })
  };

  if (extendedDoc.customFieldsData) {
    // clean custom field values
    extendedDoc.customFieldsData = await sendTRPCMessage({
      pluginName: "core",
      method: "query",
      module: "fields",
      action: "prepareCustomFieldsData",
      input: extendedDoc.customFieldsData,
      defaultValue: [],
    });
  }

  const item = await createModel(extendedDoc);
  const stage = await models.Stages.getStage(item.stageId);

  /*await createConformity({
    mainType: type,
    mainTypeId: item._id,
    companyIds: doc.companyIds,
    customerIds: doc.customerIds
  });*/

  if (user) {
    const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);

    // sendNotifications(models, {
    //   item,
    //   user,
    //   type: `${type}Add`,
    //   action: `invited you to the ${pipeline.name}`,
    //   content: `'${item.name}'.`,
    //   contentType: type
    // });

    /*await putCreateLog(
      models,
      {
        type,
        newData: extendedDoc,
        object: item
      },
      user
    );*/
  }

  /*graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
    tasksPipelinesChanged: {
      _id: stage.pipelineId,
      proccessId: doc.proccessId,
      action: "itemAdd",
      data: {
        item,
        aboveItemId: doc.aboveItemId,
        destinationStageId: stage._id
      }
    }
  });*/

  return item;
};

export const changeItemStatus = async (
  models: IModels,
  user: any,
  {
    type,
    item,
    status,
    proccessId,
    stage
  }: {
    type: string;
    item: ITask;
    status: string;
    proccessId: string;
    stage: IStage,IStageDocument;
  }
) => {
  if (status === "archived") {
    /*graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: "itemRemove",
        data: {
          item,
          oldStageId: item.stageId
        }
      }
    });*/
    return;
  }

  const { collection } = getCollection(models, type);

  const aboveItems = await collection
    .find({
      stageId: item.stageId,
      status: { $ne: BOARD_STATUSES.ARCHIVED },
      order: { $lt: item.order }
    })
    .sort({ order: -1 })
    .limit(1);

  const aboveItemId = aboveItems[0]?._id || "";

  await collection.updateOne(
    { _id: item._id },
    {
      order: await getNewOrder({
        collection,
        stageId: item.stageId,
        aboveItemId
      })
    }
  );
}; // Added missing closing bracket
 

const { collection } = getCollection(models, type);

const aboveItems = await collection
  .find({
    stageId: item.stageId,
    status: { $ne: BOARD_STATUSES.ARCHIVED },
    order: { $lt: item.order }
  })
  .sort({ order: -1 })
  .limit(1);

const aboveItemId = aboveItems[0]?._id || "";

await collection.updateOne(
  { _id: item._id },
  {
    order: await getNewOrder({
      collection,
      stageId: item.stageId,
      aboveItemId
    })
  }
);


  /*graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
    tasksPipelinesChanged: {
      _id: stage.pipelineId,
      proccessId,
      action: "itemAdd",
      data: {
        item: {
          ...item._doc,
          ...(await itemResolver(models, user, type, item))
        },
        aboveItemId,
        destinationStageId: item.stageId
      }
    }
  });*/

export const itemsEdit = async (
  models: IModels,
  _id: string,
  type: string,
  oldItem: any,
  doc: any,
  proccessId: string,
  user: IUserDocument,
  modelUpdate
) => {
  const extendedDoc = {
    ...doc,
    modifiedAt: new Date(),
    modifiedBy: user._id
  };

  const stage = await models.Stages.getStage(oldItem.stageId);

  const { canEditMemberIds } = stage;

  if (
    canEditMemberIds &&
    canEditMemberIds.length > 0 &&
    !canEditMemberIds.includes(user._id)
  ) {
    throw new Error("Permission denied");
  }

  if (extendedDoc.customFieldsData) {
    // clean custom field values
    extendedDoc.customFieldsData = await sendTRPCMessage({
      pluginName: "core",
      method: "query",
      module: "fields",
      action: "prepareCustomFieldsData",
      input: extendedDoc.customFieldsData,
      defaultValue: [],
    });
  }
}

  const updatedItem = await modelUpdate(_id, extendedDoc);
  // labels should be copied to newly moved pipeline
  if (doc.stageId) {
    await copyPipelineLabels(models, { item: oldItem, doc, user });
  }

  const notificationDoc: IBoardNotificationParams = {
    item: updatedItem,
    user,
    type: `${type}Edit`,
    contentType: type
  };

  if (doc.status && oldItem.status && oldItem.status !== doc.status) {
    const activityAction = doc.status === "active" ? "activated" : "archived";

    /*putActivityLog({
      action: "createArchiveLog",
      data: {
        item: updatedItem,
        contentType: type,
        action: "archive",
        userId: user._id,
        createdBy: user._id,
        contentId: updatedItem._id,
        content: activityAction
      }
    });*/

    // order notification
    await changeItemStatus(models, user, {
      type,
      item: updatedItem,
      status: activityAction,
      proccessId,
      stage
    });
  }

  if (doc.assignedUserIds) {
    const { addedUserIds, removedUserIds } = checkUserIds(
      oldItem.assignedUserIds,
      doc.assignedUserIds
    );

    const activityContent = { addedUserIds, removedUserIds };

    /*putActivityLog({
      action: "createAssigneLog",
      data: {
        contentId: _id,
        userId: user._id,
        contentType: type,
        content: activityContent,
        action: "assignee",
        createdBy: user._id
      }
    });*/

    notificationDoc.invitedUsers = addedUserIds;
    notificationDoc.removedUsers = removedUserIds;
  }

  // await sendNotifications(models, notificationDoc);

  if (!notificationDoc.invitedUsers && !notificationDoc.removedUsers) {
    sendTRPCMessage({
      pluginName: "core",
      method: "mutation",
      module: "notifications",
      action: "sendMobileNotification",
      input: {
        title: notificationDoc?.item?.name,
        body: `${
          user?.details?.fullName || user?.details?.shortName
        } has updated`,
      }, 
      defaultValue:[],
    });
  }

  // exclude [null]
  if (doc.tagIds && doc.tagIds.length) {
    doc.tagIds = doc.tagIds.filter(ti => ti);
  }

  /*putUpdateLog(
    models,
    {
      type,
      object: oldItem,
      newData: extendedDoc,
      updatedDocument: updatedItem
    },
    user
  );*/

  const updatedStage = await models.Stages.getStage(updatedItem.stageId);

  if (doc.tagIds || doc.startDate || doc.closeDate || doc.name) {
    /*graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId
      }
    });
  }*/

  if (updatedStage.pipelineId !== stage.pipelineId) {
    /*graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: "itemRemove",
        data: {
          item: oldItem,
          oldStageId: stage._id
        }
      }
    });
    graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: updatedStage.pipelineId,
        proccessId,
        action: "itemAdd",
        data: {
          item: {
            ...updatedItem._doc,
            ...(await itemResolver(models, user, type, updatedItem))
          },
          aboveItemId: "",
          destinationStageId: updatedStage._id
        }
      }
    });
  } else {
    graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: "itemUpdate",
        data: {
          item: {
            ...updatedItem._doc,
            ...(await itemResolver(models, user, type, updatedItem))
          }
        }
      }
    });
  }*/

  if (oldItem.stageId === updatedItem.stageId) {
    return updatedItem;
  }

  // if task moves between stages
  const { content, action } = await itemMover(
    models,
    user._id,
    oldItem,
    type,
    updatedItem.stageId
  );

  // await sendNotifications(models, {
  //   item: updatedItem,
  //   user,
  //   type: `${type}Change`,
  //   content,
  //   action,
  //   contentType: type
  // });

  return updatedItem;
};

const itemMover = async (
  models: IModels,
  userId: string,
  item: ITaskDocument,
  contentType: string,
  destinationStageId: string
) => {
  const oldStageId = item.stageId;

  let action = `changed order of your ${contentType}:`;
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

    const link = `/${contentType}/board?id=${board._id}&pipelineId=${pipeline._id}&itemId=${item._id}`;

    const activityLogContent = {
      oldStageId,
      destinationStageId,
      text: `${oldStage.name} to ${stage.name}`
    };

    /*await putActivityLog({
      action: "createBoardItemMovementLog",
      data: {
        item,
        contentType,
        userId,
        activityLogContent,
        link,
        action: "moved",
        contentId: item._id,
        createdBy: userId,
        content: activityLogContent
      }
    });*/

    sendTRPCMessage({
      pluginName: "core",
      method: "mutation",
      module: "notifications",
      action: "batchUpdate",
      input: {
        selector: { contentType, contentTypeId: item._id },
        modifier: { $set: { link } }
      },
      defaultValue:[],
    });
  }

  return { content, action };
};

export const checkMovePermission = (
  stage: IStageDocument,
  user: IUserDocument
) => {
  if (
    stage.canMoveMemberIds &&
    stage.canMoveMemberIds.length > 0 &&
    !stage.canMoveMemberIds.includes(user._id)
  ) {
    throw new Error("Permission denied");
  }
};

export const itemsChange = async (
  models: IModels,
  doc: IItemDragCommonFields,
  type: string,
  user: IUserDocument,
  modelUpdate: any
) => {
  const { collection } = getCollection(models, type);

  const { proccessId, itemId, aboveItemId, destinationStageId, sourceStageId } =
    doc;

  const item = await getItem(models, type, { _id: itemId });
  const stage = await models.Stages.getStage(item.stageId);

  const extendedDoc: IItemCommonFields = {
    modifiedAt: new Date(),
    modifiedBy: user._id,
    stageId: destinationStageId,
    order: await getNewOrder({
      collection,
      stageId: destinationStageId,
      aboveItemId
    })
  };

  if (item.stageId !== destinationStageId) {
    checkMovePermission(stage, user);

    const destinationStage = await models.Stages.getStage(destinationStageId);

    checkMovePermission(destinationStage, user);

    extendedDoc.stageChangedDate = new Date();
  }

  const updatedItem = await modelUpdate(itemId, extendedDoc);

  const { content, action } = await itemMover(
    models,
    user._id,
    item,
    type,
    destinationStageId
  );

  // await sendNotifications(models, {
  //   item,
  //   user,
  //   type: `${type}Change`,
  //   content,
  //   action,
  //   contentType: type
  // });

  if (item?.assignedUserIds && item?.assignedUserIds?.length > 0) {
    sendTRPCMessage({
      pluginName: "core",
      method: "mutation",
      module: "notifications",
      action: "sendMobileNotification",
      input: {
        title: `${item.name}`,
        body: `${user?.details?.fullName || user?.details?.shortName} ${action + content}`,
        receivers: item?.assignedUserIds,
        data: {
          type,
          id: item._id
        }
      }
    });
  }

  // await putUpdateLog(
  //   models,
  //   {
  //     type,
  //     object: item,
  //     newData: extendedDoc,
  //     updatedDocument: updatedItem
  //   },
  //   user
  // );

  // order notification
  const labels = await models.PipelineLabels.find({
    _id: {
      $in: item.labelIds
    }
  });

  /*graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
    tasksPipelinesChanged: {
      _id: stage.pipelineId,
      proccessId,
      action: "orderUpdated",
      data: {
        item: {
          ...item._doc,
          ...(await itemResolver(models, user, type, item)),
          labels
        },
        aboveItemId,
        destinationStageId,
        oldStageId: sourceStageId
      }
    }
  });*/

  return item;
};

export const itemsRemove = async (
  models: IModels,
  _id: string,
  type: string,
  user: IUserDocument
) => {
  const item = await getItem(models, type, { _id });

  // await sendNotifications(models, {
  //   item,
  //   user,
  //   type: `${type}Delete`,
  //   action: `deleted ${type}:`,
  //   content: `'${item.name}'`,
  //   contentType: type
  // });

  if (item?.assignedUserIds && item?.assignedUserIds?.length > 0) {
    sendTRPCMessage({
      pluginName: "core",
      method: "mutation",
      module: "notifications",
      action: "sendMobileNotification",
      input: {
        title: `${item.name}`,
        body: `${user?.details?.fullName || user?.details?.shortName} deleted the ${type}`,
        receivers: item?.assignedUserIds,
        data: {
          type,
          id: item._id
        }
      }
    });
  }

  await destroyBoardItemRelations(models, item._id, type);

  const removed = await getCollection(models, type).collection.findOneAndDelete(
    { _id: item._id }
  );

  // await putDeleteLog(models, { type, object: item }, user);

  return removed;
};

export const itemsCopy = async (
  models: IModels,
  _id: string,
  proccessId: string,
  type: string,
  user: IUserDocument,
  extraDocParam: string[],
  modelCreate: any
) => {
  const { collection } = getCollection(models, type);
  const item = await collection.findOne({ _id }).lean();

  const doc = await prepareBoardItemDoc(item, collection, user._id);

  delete doc.sourceConversationIds;

  for (const param of extraDocParam) {
    doc[param] = item[param];
  }

  const clone = await modelCreate(doc);

  const companyIds = await getCompanyIds(type, _id);
  const customerIds = await getCustomerIds(type, _id);

  /*await createConformity({
    mainType: type,
    mainTypeId: clone._id,
    customerIds,
    companyIds
  });*/

  await copyChecklists(models, {
    contentType: type,
    contentTypeId: item._id,
    targetContentId: clone._id,
    user
  });

  // order notification
  const stage = await models.Stages.getStage(clone.stageId);

  /*graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
    tasksPipelinesChanged: {
      _id: stage.pipelineId,
      proccessId,
      action: "itemAdd",
      data: {
        item: {
          ...clone._doc,
          ...(await itemResolver(models, user, type, clone))
        },
        aboveItemId: _id,
        destinationStageId: stage._id
      }
    }
  });*/

  await publishHelperItemsConformities(clone, stage);

  return clone;
};

export const itemsArchive = async (
  models: IModels,
  stageId: string,
  type: string,
  proccessId: string,
  user: IUserDocument
) => {
  const { collection } = getCollection(models, type);

  const items = await collection
    .find({
      stageId,
      status: { $ne: BOARD_STATUSES.ARCHIVED }
    })
    .lean();

  await collection.updateMany(
    { stageId },
    { $set: { status: BOARD_STATUSES.ARCHIVED } }
  );

  // order notification
  const stage = await models.Stages.getStage(stageId);

  /*for (const item of items) {
    await putActivityLog({
      action: "createArchiveLog",
      data: {
        item,
        contentType: type,
        action: "archive",
        userId: user._id,
        createdBy: user._id,
        contentId: item._id,
        content: "archived"
      }
    });

    graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
      tasksPipelinesChanged: {
        _id: stage.pipelineId,
        proccessId,
        action: "itemsRemove",
        data: {
          item,
          destinationStageId: stage._id
        }
      }
    });
  }*/

  return "ok";
};

export const publishHelperItemsConformities = async (
  item: ITaskDocument,
  stage: IStageDocument
) => {
  /*graphqlPubsub.publish(`tasksPipelinesChanged:${stage.pipelineId}`, {
    tasksPipelinesChanged: {
      _id: stage.pipelineId,
      proccessId: Math.random().toString(),
      action: "itemOfConformitiesUpdate",
      data: {
        item: {
          ...item
        }
      }
    }
  });*/
};

export const publishHelper = async (
  type: string,
  itemId: string
) => {
  const models = await generateModels(models);

  const item = await getItem(models, type, { _id: itemId });

  const stage = await models.Stages.getStage(item.stageId);
  await publishHelperItemsConformities(item, stage);
};


export interface IArchiveArgs {
  pipelineId: string;
  search: string;
  page?: number;
  perPage?: number;
  userIds?: string[];
  priorities?: string[];
  assignedUserIds?: string[];
  labelIds?: string[];
  productIds?: string[];
  companyIds?: string[];
  customerIds?: string[];
  startDate?: string;
  endDate?: string;
  sources?: string[];
  hackStages?: string[];
}

const contains = (values: string[]) => {
  return { $in: values };
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
    closeDateEndDate
  } = extraParams;

  const isListEmpty = value => {
    return value.length === 1 && value[0].length === 0;
  };

  if (source) {
    filter.source = contains(source);
  }

  if (userIds) {
    const isEmpty = isListEmpty(userIds);

    filter.userId = isEmpty ? { $in: [null, []] } : { $in: userIds };
  }

  if (priority) {
    filter.priority = contains(priority);
  }

  if (startDate) {
    filter.closeDate = {
      $gte: new Date(startDate)
    };
  }

  if (endDate) {
    if (filter.closeDate) {
      filter.closeDate.$lte = new Date(endDate);
    } else {
      filter.closeDate = {
        $lte: new Date(endDate)
      };
    }
  }

  if (createdStartDate || createdEndDate) {
    filter.createdAt = {
      $gte: new Date(createdStartDate),
      $lte: new Date(createdEndDate)
    };
  }

  if (stateChangedStartDate || stateChangedEndDate) {
    filter.stageChangedDate = {
      $gte: new Date(stateChangedStartDate),
      $lte: new Date(stateChangedEndDate)
    };
  }

  if (startDateStartDate || startDateEndDate) {
    filter.startDate = {
      $gte: new Date(startDateStartDate),
      $lte: new Date(startDateEndDate)
    };
  }

  if (closeDateStartDate || closeDateEndDate) {
    filter.closeDate = {
      $gte: new Date(closeDateStartDate),
      $lte: new Date(closeDateEndDate)
    };
  }

  return filter;
};

export const generateCommonFilters = async (
  models: IModels,
  subdomain: string,
  currentUserId: string,
  args: any
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
    customerIds,
    companyIds,
    conformityMainType,
    conformityMainTypeId,
    conformityIsRelated,
    conformityIsSaved,
    initialStageId,
    type,
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
    resolvedDayBetween
  } = args;

  const isListEmpty = value => {
    return value.length === 1 && value[0].length === 0;
  };

  const filter: any = noSkipArchive
    ? {}
    : { status: { $ne: BOARD_STATUSES.ARCHIVED }, parentId: undefined };

  let filterIds: string[] = [];

  if (parentId) {
    filter.parentId = parentId;
  }

  if (assignedUserIds) {
    // Filter by assigned to no one
    const notAssigned = isListEmpty(assignedUserIds);

    filter.assignedUserIds = notAssigned ? [] : contains(assignedUserIds);
  }

  if (branchIds) {
    const branches = await sendTRPCMessage({
      pluginName:'find with child',
      method: 'query',
      module: 'branches',
      action: 'findWithChild',
      input: {
        query: { _id: { $in: branchIds } },
        fields: { _id: 1 }
      },
      defaultValue: []
    });

    filter.branchIds = { $in: branches.map(item => item._id) };
  }

  if (departmentIds) {
    const departments = await sendTRPCMessage({
      pluginName:'find with child',
      method: 'query',
      module: 'departments',
      action: `departments.findWithChild`,
      input: {
        query: { _id: { $in: departmentIds } },
        fields: { _id: 1 }
      },
      defaultValue: [],
    });

    filter.departmentIds = { $in: departments.map(item => item._id) };
  }

  if (customerIds && type) {
    const relIds = await sendTRPCMessage({
      pluginName: 'filter conformity',
      method:'mutation',
      module:'conformities',
      action: 'conformities.filterConformity',
      input: {
        mainType: 'customer',
        mainTypeIds: customerIds,
        relType: type
      },
      defaultValue: [],
    });

    filterIds = relIds;
  }

  if (companyIds && type) {
    const relIds = await sendTRPCMessage({
      pluginName:'filter conformity',
      method: 'mutation',
      module: 'conformities',
      action: 'filterConformity',
      input: {
        mainType: 'company',
        mainTypeIds: companyIds,
        relType: type
      },
      defaultValue: []
    });

    filterIds = filterIds.length
      ? filterIds.filter(id => relIds.includes(id))
      : relIds;
  }

  if (customerIds || companyIds) {
    filter._id = contains(filterIds || []);
  }

  if (_ids && _ids.length) {
    filter._id = contains(_ids);
  }

  if (conformityMainType && conformityMainTypeId) {
    if (conformityIsSaved) {
      const relIds = await sendTRPCMessage({
        pluginName: 'save conformity',
        method:'query',
        module: 'conformities',
        action: 'avedConformity',
        input: {
          mainType: conformityMainType,
          mainTypeId: conformityMainTypeId,
          relTypes: [type]
        },
        defaultValue: [],
      });

      filter._id = contains(relIds || []);
    }

    if (conformityIsRelated) {
      const relIds = await sendTRPCMessage({
        pluginName: 'relate conformity',
        method: 'query',
        module: 'conformities',
        action: 'conformities.relatedConformity',
        input: {
          mainType: conformityMainType,
          mainTypeId: conformityMainTypeId,
          relType: type
        },
        defaultValue: []
      });

      filter._id = contains(relIds);
    }
  }

  if (initialStageId) {
    filter.initialStageId = initialStageId;
  }

  if (closeDateType) {
    filter.closeDate = getCloseDateByType(closeDateType);
  }

  if (startDate) {
    filter.closeDate = {
      $gte: new Date(startDate)
    };
  }

  if (endDate) {
    if (filter.closeDate) {
      filter.closeDate.$lte = new Date(endDate);
    } else {
      filter.closeDate = {
        $lte: new Date(endDate)
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
      status: { $ne: BOARD_STATUSES.ARCHIVED }
    }).distinct('_id');

    filter.stageId = { $in: stageIds };
  }

  if (boardIds) {
    const pipelineIds = await models.Pipelines.find({
      boardId: { $in: boardIds },
      status: { $ne: BOARD_STATUSES.ARCHIVED }
    }).distinct('_id');

    const filterStages: any = {
      pipelineId: { $in: pipelineIds },
      status: { $ne: BOARD_STATUSES.ARCHIVED }
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
    filter.priority = contains(priority);
  }

  if (tagIds) {
    filter.tagIds = { $in: tagIds };
  }

  if (pipelineId) {
    const pipeline = await models.Pipelines.getPipeline(pipelineId);
    const user = await sendTRPCMessage({
      pluginName: 'find one',
      method: 'query',
      module: 'users',
      action: 'findOne',
      input: {
        _id: currentUserId
      },
      defaultValue:[],

    });
    const tmp =
      (await sendTRPCMessage({
        pluginName:'find with child',
        method: 'query',
        module: 'departments',
        action: 'findWithChild',
        input: {
          query: {
            supervisorId: currentUserId
          },
          fields: {
            _id: 1
          }
        },
        defaultValue:[],
        
      })) || [];

    const supervisorDepartmentIds = tmp?.map(x => x._id) || [];
    const pipelineDepartmentIds = pipeline.departmentIds || [];

    const commonIds =
      supervisorDepartmentIds.filter(id =>
        pipelineDepartmentIds.includes(id)
      ) || [];
    const isEligibleSeeAllCards = (pipeline.excludeCheckUserIds || []).includes(
      currentUserId
    );
    if (
      commonIds?.length > 0 &&
      (pipeline.isCheckUser || pipeline.isCheckDepartment) &&
      !isEligibleSeeAllCards
    ) {
      // current user is supervisor in departments and this pipeline has included that some of user's departments
      // so user is eligible to see all cards of people who share same department.
      const otherDepartmentUsers = await sendTRPCMessage({
        pluginName: 'find',
        method:'query',
        module:'users',
        action: 'users.find',
        input: {
          query: { departmentIds: { $in: commonIds } }
        },
        defaultValue: [],
      });
      let includeCheckUserIds = otherDepartmentUsers.map(x => x._id) || [];
      includeCheckUserIds = includeCheckUserIds.concat(user._id || []);

      const uqinueCheckUserIds = [
        ...new Set(includeCheckUserIds.concat(currentUserId))
      ];

      Object.assign(filter, {
        $or: [
          { assignedUserIds: { $in: uqinueCheckUserIds } },
          { userId: { $in: uqinueCheckUserIds } }
        ]
      });
    } else {
      if (
        (pipeline.isCheckUser || pipeline.isCheckDepartment) &&
        !isEligibleSeeAllCards
      ) {
        let includeCheckUserIds: string[] = [];

        if (pipeline.isCheckDepartment) {
          const userDepartmentIds = user?.departmentIds || [];
          const commonIds = userDepartmentIds.filter(id =>
            pipelineDepartmentIds.includes(id)
          );

          const otherDepartmentUsers = await sendTRPCMessage({
            pluginName:'find',
            method:'query',
            module:'users',
            action: 'users.find',
            input: {
              query: { departmentIds: { $in: commonIds } }
            },
            defaultValue: []
          });

          for (const departmentUser of otherDepartmentUsers) {
            includeCheckUserIds = [...includeCheckUserIds, departmentUser._id];
          }

          if (
            !!pipelineDepartmentIds.filter(departmentId =>
              userDepartmentIds.includes(departmentId)
            ).length
          ) {
            includeCheckUserIds = includeCheckUserIds.concat(user._id || []);
          }
        }

        const uqinueCheckUserIds = [
          ...new Set(includeCheckUserIds.concat(currentUserId))
        ];

        Object.assign(filter, {
          $or: [
            { assignedUserIds: { $in: uqinueCheckUserIds } },
            { userId: { $in: uqinueCheckUserIds } }
          ]
        });
      }
    }
  }

  if (userIds) {
    const isEmpty = isListEmpty(userIds);

    filter.userId = isEmpty ? { $in: [null, []] } : { $in: userIds };
  }

  if (assignedToMe) {
    filter.assignedUserIds = { $in: [currentUserId] };
  }

  // if (segmentData) {
  //   const segment = JSON.parse(segmentData);
  //  /*const itemIds = await fetchSegment(subdomain, '', {}, segment);*/
  //   filter._id = { $in: itemIds };
  // }

  // if (segment) {
  //   const segmentObj = await sendCoreMessage({
  //     subdomain,
  //     action: 'segmentFindOne',
  //     data: { _id: segment },
  //     isRPC: true
  //   });
  //   /*const itemIds = await fetchSegment(subdomain, segmentObj);*/

  //   filter._id = { $in: itemIds };
  // }

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
                1000 * 60 * 60 * 24 // Convert milliseconds to days
              ]
            },
            dayFrom // Minimum day (0 days)
          ]
        },
        {
          $lt: [
            {
              $divide: [
                { $subtract: ['$stageChangedDate', '$createdAt'] },
                1000 * 60 * 60 * 24
              ]
            },
            dayTo // Maximum day (3 days)
          ]
        }
      ]
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
    closeDateEndDate
  } = args;

  if (date) {
    const stageIds = await models.Stages.find({ pipelineId }).distinct('_id');

    filter.closeDate = dateSelector(date);
    filter.stageId = { $in: stageIds };
  }

  if (createdStartDate || createdEndDate) {
    filter.createdAt = {
      $gte: new Date(createdStartDate),
      $lte: new Date(createdEndDate)
    };
  }
  if (stateChangedStartDate || stateChangedEndDate) {
    filter.stageChangedDate = {
      $gte: new Date(stateChangedStartDate),
      $lte: new Date(stateChangedEndDate)
    };
  }
  if (startDateStartDate || startDateEndDate) {
    filter.startDate = {
      $gte: new Date(startDateStartDate),
      $lte: new Date(startDateEndDate)
    };
  }
  if (closeDateStartDate || closeDateEndDate) {
    filter.closeDate = {
      $gte: new Date(closeDateStartDate),
      $lte: new Date(closeDateEndDate)
    };
  }

  return filter;
};

// export const generateDealCommonFilters = async (
//   models: IModels,
//   subdomain: string,
//   currentUserId: string,
//   args = {} as any,
//   extraParams?: any
// ) => {
//   args.type = 'deal';
//   const { productIds } = extraParams || args;
//   let filter = await generateCommonFilters(
//     models,
//     subdomain,
//     currentUserId,
//     args
//   );

//   if (extraParams) {
//     filter = await generateExtraFilters(filter, extraParams);
//   }

//   if (productIds) {
//     filter['productsData.productId'] = contains(productIds);
//   }

//   // Calendar monthly date
//   await calendarFilters(models, filter, args);

//   return filter;
// };

export const generateTaskCommonFilters = async (
  models: IModels,
  subdomain: string,
  currentUserId: string,
  args = {} as any,
  extraParams?: any
) => {
  args.type = 'task';
  const { productIds } = extraParams || args;

  let filter = await generateCommonFilters(
    models,
    subdomain,
    currentUserId,
    args
  );

  if (extraParams) {
    filter = await generateExtraFilters(filter, extraParams);
  }

  if (productIds) {
    filter['productsData.productId'] = contains(productIds);
  }

  // Calendar monthly date
  await calendarFilters(models, filter, args);


  return await generateTaskCommonFilters(models, subdomain, currentUserId, args);

};



export const generateSort = (args: IListParams) => {
  let sort: any = { order: 1, createdAt: -1 };

  const { sortField, sortDirection } = args;

  if (sortField && sortDirection) {
    sort = { [sortField]: sortDirection };
  }

  return sort;
};

export const generateGrowthHackCommonFilters = async (
  models: IModels,
  subdomain: string,
  currentUserId: string,
  args = {} as any,
  extraParams?: any
) => {
  args.type = 'growthHack';

  const { hackStage, pipelineId, stageId } = extraParams || args;

  let filter = await generateCommonFilters(
    models,
    subdomain,
    currentUserId,
    args
  );

  if (extraParams) {
    filter = await generateExtraFilters(filter, extraParams);
  }

  if (hackStage) {
    filter.hackStages = contains(hackStage);
  }

  if (!stageId && pipelineId) {
    const stageIds = await models.Stages.find({ pipelineId }).distinct('_id');

    filter.stageId = { $in: stageIds };
  }

  return filter;
};

interface IDate {
  month: number;
  year: number;
}

const dateSelector = (date: IDate) => {
  const { year, month } = date;

  const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));

  return {
    $gte: start,
    $lte: end
  };
};

// comparing pipelines departmentIds and current user departmentIds
const compareDepartmentIds = (
  pipelineDepartmentIds: string[],
  userDepartmentIds: string[]
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



export const archivedItems = async (
  models: IModels,
  params: IArchiveArgs,
  collection: any
) => {
  const { pipelineId, ...listArgs } = params;

  const { page = 0, perPage = 0 } = listArgs;

  const stages = await models.Stages.find({ pipelineId }).lean();

  if (stages.length > 0) {
    const filter = generateArhivedItemsFilter(params, stages);

    return collection
      .find(filter)
      .sort({
        modifiedAt: -1
      })
      .skip(page || 0)
      .limit(perPage || 20)
      .lean();
  }
  if (archivedItems.length >  0){
    console.log("Found archived items");
  }
  return archivedItems(models,params,collection);
};

export const archivedItemsCount = async (
  models: IModels,
  params: IArchiveArgs,
  collection: any,
) => {
  const { pipelineId } = params;

  const stages = await models.Stages.find({ pipelineId });

  if (stages.length > 0) {
    const filter = generateArhivedItemsFilter(params, stages);

    return collection.find(filter).countDocuments();
  }

  return archivedItemsCount(models,params,collection);
};

const generateArhivedItemsFilter = (
  params: IArchiveArgs,
  stages: IStageDocument[]
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
    hackStages
  } = params;

  const filter: any = { status: BOARD_STATUSES.ARCHIVED };

  filter.stageId = { $in: stages.map(stage => stage._id) };

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
      $gte: new Date(startDate)
    };
  }

  if (endDate) {
    if (filter.closeDate) {
      filter.closeDate.$lte = new Date(endDate);
    } else {
      filter.closeDate = {
        $lte: new Date(endDate)
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

export const getItemList = async (
  models: IModels,
  subdomain: string,
  filter: any,
  args: IListParams,
  user: IUserDocument,
  type: string,
  extraFields?: { [key: string]: number },
  getExtraFields?: (item: any) => { [key: string]: any },
  serverTiming?
) => { 
  const items = await getItemList(models, subdomain, filters, args, user, type);
  const { collection } = getCollection(models, type);
  const { page, perPage } = args;
  const sort = generateSort(args);
  let limit = args.limit !== undefined ? args.limit : 10;

  const pipelines: any[] = [
    {
      $match: filter
    },
    {
      $sort: sort
    },
    {
      $skip: args.skip || 0
    },
    {
      $lookup: {
        from: 'users',
        localField: 'assignedUserIds',
        foreignField: '_id',
        as: 'users_doc'
      }
    },
    {
      $lookup: {
        from: 'tasks_stages',
        localField: 'stageId',
        foreignField: '_id',
        as: 'stages_doc'
      }
    },
    {
      $lookup: {
        from: 'tasks_pipeline_labels',
        localField: 'labelIds',
        foreignField: '_id',
        as: 'labels_doc'
      }
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
        ...(extraFields || {})
      }
    }
  ];

  if (page && perPage) {
    pipelines[2] = {
      $skip: (page - 1) * perPage
    };
    limit = perPage;
  }

  if (limit > 0) {
    pipelines.splice(3, 0, { $limit: limit });
  }

  if (serverTiming) {
    serverTiming.startTime('getItemsPipelineAggregate');
  }

  const list = await collection.aggregate(pipelines);

  if (serverTiming) {
    serverTiming.endTime('getItemsPipelineAggregate');
  }

  const ids = list.map(item => item._id);

  if (serverTiming) {
    serverTiming.startTime('conformities');
  }

  const conformities = await sendTRPCMessage({
    pluginName: 'get conformities',
    method: 'mutation',
    module: 'conformities',
    action: 'get Conformities',
    input: {
      mainType: type,
      mainTypeIds: ids,
      relTypes: ['company', 'customer']
    },
    defaultValue: [],
  });

  if (serverTiming) {
    serverTiming.endTime('conformities');
  }

  const companyIds: string[] = [];
  const customerIds: string[] = [];
  const companyIdsByItemId = {};
  const customerIdsByItemId = {};

  const perConformity = (
    conformity,
    cocIdsByItemId,
    cocIds,
    typeId1,
    typeId2
  ) => {
    cocIds.push(conformity[typeId1]);

    if (!cocIdsByItemId[conformity[typeId2]]) {
      cocIdsByItemId[conformity[typeId2]] = [];
    }

    cocIdsByItemId[conformity[typeId2]].push(conformity[typeId1]);
  };

  for (const conf of conformities) {
    if (conf.mainType === 'company') {
      perConformity(
        conf,
        companyIdsByItemId,
        companyIds,
        'mainTypeId',
        'relTypeId'
      );
      continue;
    }
    if (conf.relType === 'company') {
      perConformity(
        conf,
        companyIdsByItemId,
        companyIds,
        'relTypeId',
        'mainTypeId'
      );
      continue;
    }
    if (conf.mainType === 'customer') {
      perConformity(
        conf,
        customerIdsByItemId,
        customerIds,
        'mainTypeId',
        'relTypeId'
      );
      continue;
    }
    if (conf.relType === 'customer') {
      perConformity(
        conf,
        customerIdsByItemId,
        customerIds,
        'relTypeId',
        'mainTypeId'
      );
      continue;
    }
  }

  if (serverTiming) {
    serverTiming.startTime('getItemsCompanies');
  }

  const companies = await sendTRPCMessage({
    pluginName: 'find active companies',
    method: 'query',
    module: 'companies',
    action: 'findActiveCompanies',
    input: {
      selector: {
        _id: { $in: [...new Set(companyIds)] }
      },

      fields: {
        primaryName: 1,
        primaryEmail: 1,
        primaryPhone: 1,
        emails: 1,
        phones: 1
      }
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
    pluginName: 'find active customers',
    method: 'query',
    module: 'customers',
    action: 'customers.findActiveCustomers',
    input: {
      selector: {
        _id: { $in: [...new Set(customerIds)] }
      },
      fields: {
        firstName: 1,
        lastName: 1,
        middleName: 1,
        visitorContactInfo: 1,
        primaryEmail: 1,
        primaryPhone: 1,
        emails: 1,
        phones: 1
      }
    },
    defaultValue: [],
  });

  if (serverTiming) {
    serverTiming.endTime('getItemsCustomers');
  }

  const getCocsByItemId = (
    itemId: string,
    cocIdsByItemId: any,
    cocs: any[]
  ) => {
    const cocIds = cocIdsByItemId[itemId] || [];

    return cocIds.flatMap((cocId: string) => {
      const found = cocs.find(coc => cocId === coc._id);

      return found || [];
    });
  };

  const updatedList: any[] = [];

  if (serverTiming) {
    serverTiming.startTime('getItemsNotifications');
  }

  const notifications = await sendNotificationsMessage({
    subdomain,
    action: 'find',
    data: {
      selector: {
        contentTypeId: { $in: ids },
        isRead: false,
        receiver: user._id
      },
      fields: { contentTypeId: 1 }
    },
    defaultValue: []
  });

  if (serverTiming) {
    serverTiming.endTime('getItemsNotifications');
  }

  if (serverTiming) {
    serverTiming.startTime('getItemsFields');
  }

  const fields = await sendTRPCMessage({
    pluginName: 'find',
    method: 'query',
    module: 'fields',
    action: 'find',
    input: {
      query: {
        showInCard: true,
        contentType: `tasks:${type}`
      }
    },
    defaultValue: []
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

      fields.forEach(field => {
        const fieldData = item.customFieldsData.find(
          f => f.field === field._id
        );

        if (fieldData) {
          item.customProperties.push({
            name: `${field.text} - ${fieldData.value}`
          });
        }
      });
    }

    const notification = notification.find(n => n.contentTypeId === item._id);

    updatedList.push({
      ...item,
      order: order++,
      isWatched: (item.watchedUserIds || []).includes(user._id),
      hasNotified: notification ? false : true,
      customers: getCocsByItemId(item._id, customerIdsByItemId, customers),
      companies: getCocsByItemId(item._id, companyIdsByItemId, companies),
      ...(getExtraFields ? await getExtraFields(item) : {})
    });
  }

  return updatedList;

};
  

export const getCloseDateByType = (closeDateType: string) => {
  if (closeDateType === CLOSE_DATE_TYPES.NEXT_DAY) {
    const tommorrow = moment().add(1, 'days');

    return {
      $gte: new Date(tommorrow.startOf('day').toISOString()),
      $lte: new Date(tommorrow.endOf('day').toISOString())
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
      $lte: new Date(nextSunday)
    };
  }

  if (closeDateType === CLOSE_DATE_TYPES.NEXT_MONTH) {
    const now = new Date();
    const { start, end } = getNextMonth(now);

    return {
      $gte: new Date(start),
      $lte: new Date(end)
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

