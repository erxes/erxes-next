import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ITaskDocument } from '~/modules/tasks/@types/tasks';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.Tasks.findOne({ _id });
  },

  async companies(
    task: ITaskDocument,
    _args,
    _context: IContext,
    { isSubscription },
  ) {
    if (!task.companyIds?.length) {
      return [];
    }

    const activeCompanies = await sendTRPCMessage({
      pluginName: 'core',
      module: 'companies',
      action: 'findActiveCompanies',
      input: {
        selector: { _id: { $in: task.companyIds } },
      },
      defaultValue: [],
    });

    if (isSubscription) {
      return activeCompanies;
    }

    return (activeCompanies || []).map(({ _id }) => ({
      __typename: 'Company',
      _id,
    }));
  },

  createdUser(task: ITaskDocument) {
    if (!task.userId) {
      return;
    }

    return { __typename: 'User', _id: task.userId };
  },

  async customers(
    task: ITaskDocument,
    _args,
    _context: IContext,
    { isSubscription },
  ) {
    if (!task.customerIds?.length) {
      return [];
    }

    const customers = await sendTRPCMessage({
      pluginName: 'core',
      module: 'customers',
      action: 'findActiveCustomers',
      input: {
        selector: {
          _id: { $in: task.customerIds },
        },
      },
      defaultValue: [],
    });

    if (isSubscription) {
      return customers;
    }

    return (customers || []).map(({ _id }) => ({
      __typename: 'Customer',
      _id,
    }));
  },

  async assignedUsers(
    task: ITaskDocument,
    _args,
    _context: IContext,
    { isSubscription },
  ) {
    if (isSubscription && task.assignedUserIds?.length) {
      return sendTRPCMessage({
        pluginName: 'core',
        module: 'users',
        action: 'find',
        input: {
          query: {
            _id: { $in: task.assignedUserIds },
          },
        },
        defaultValue: [],
      });
    }

    return (task.assignedUserIds || [])
      .filter((e) => e)
      .map((_id) => ({
        __typename: 'User',
        _id,
      }));
  },

  async pipeline(task: ITaskDocument, _args, { models }: IContext) {
    const stage = await models.Stages.getStage(task.stageId);

    return models.Pipelines.findOne({ _id: stage.pipelineId });
  },

  async boardId(task: ITaskDocument, _args, { models }: IContext) {
    const stage = await models.Stages.getStage(task.stageId);
    const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);
    const board = await models.Boards.getBoard(pipeline.boardId);

    return board._id;
  },

  async stage(task: ITaskDocument, _args, { models }: IContext) {
    return models.Stages.getStage(task.stageId);
  },

  async isWatched(task: ITaskDocument, _args, { user }: IContext) {
    const watchedUserIds = task.watchedUserIds || [];

    if (watchedUserIds.includes(user._id)) {
      return true;
    }

    return false;
  },

  // async hasNotified(task: ITaskDocument, _args, { user }: IContext) {
  //   return sendNotificationsMessage({
  //     subdomain,
  //     action: 'checkIfRead',
  //     data: {
  //       userId: user._id,
  //       itemId: task._id,
  //     },
  //     isRPC: true,
  //     defaultValue: true,
  //   });
  // },

  async tags(task: ITaskDocument) {
    return (task.tagIds || [])
      .filter((_id) => !!_id)
      .map((_id) => ({ __typename: 'Tag', _id }));
  },

  async labels(task: ITaskDocument, _args, { models }: IContext) {
    return models.PipelineLabels.find({ _id: { $in: task.labelIds || [] } });
  },
};
