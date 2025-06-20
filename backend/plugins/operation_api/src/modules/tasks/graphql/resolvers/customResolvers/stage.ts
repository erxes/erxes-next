import { IContext } from '~/connectionResolvers';
import { IStageDocument } from '~/modules/tasks/@types/stages';
import { TASK_STATUSES, VISIBILITIES } from '~/modules/tasks/constants';
import {
  generateFilter,
  getAmountsMap,
} from '~/modules/tasks/graphql/resolvers/utils';

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.Stages.findOne({ _id });
  },

  members(stage: IStageDocument) {
    if (stage.visibility === VISIBILITIES.PRIVATE && stage.memberIds) {
      return stage.memberIds.map((memberId) => ({
        __typename: 'User',
        _id: memberId,
      }));
    }

    return [];
  },

  async unUsedAmount(
    stage: IStageDocument,
    _args,
    { user, models }: IContext,
    { variableValues: args },
  ) {
    const amountsMap = getAmountsMap(
      models,
      models.Tasks,
      user,
      args,
      stage,
      false,
    );

    return amountsMap;
  },

  async amount(
    stage: IStageDocument,
    _args,
    { user, models }: IContext,
    { variableValues: args },
  ) {
    const amountsMap = getAmountsMap(models, models.Tasks, user, args, stage);

    return amountsMap;
  },

  async itemsTotalCount(
    stage: IStageDocument,
    _args,
    { user, models }: IContext,
    { variableValues: args },
  ) {
    const filter = await generateFilter(
      models,
      user._id,
      { ...args, stageId: stage._id, pipelineId: stage.pipelineId },
      args.extraParams,
    );

    return models.Tasks.find(filter).countDocuments();
  },

  /*
   * Total count of task that are created on this stage initially
   */
  async initialTaskTotalCount(
    stage: IStageDocument,
    _args,
    { user, models }: IContext,
    { variableValues: args },
  ) {
    const filter = await generateFilter(
      models,
      user._id,
      { ...args, initialStageId: stage._id },
      args.extraParams,
    );

    return models.Tasks.find(filter).countDocuments();
  },

  /*
   * Total count of tasks that are
   * 1. created on this stage initially
   * 2. moved to other stage which has probability other than Lost
   */
  async inProcessTasksTotalCount(
    stage: IStageDocument,
    _args,
    { models: { Stages } }: IContext,
  ) {
    const filter = {
      pipelineId: stage.pipelineId,
      probability: { $ne: 'Lost' },
      _id: { $ne: stage._id },
    };

    const tasks = await Stages.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'tasks',
          let: { stageId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$stageId', '$$stageId'] },
                    { $ne: ['$status', TASK_STATUSES.ARCHIVED] },
                  ],
                },
              },
            },
          ],
          as: 'tasks',
        },
      },
      {
        $project: {
          name: 1,
          tasks: 1,
        },
      },
      {
        $unwind: '$tasks',
      },
      {
        $match: {
          'tasks.initialStageId': stage._id,
        },
      },
    ]);

    return tasks.length;
  },

  async stayedTasksTotalCount(
    stage: IStageDocument,
    _args,
    { user, models }: IContext,
    { variableValues: args },
  ) {
    const filter = await generateFilter(
      models,
      user._id,
      {
        ...args,
        initialStageId: stage._id,
        stageId: stage._id,
        pipelineId: stage.pipelineId,
      },
      args.extraParams,
    );

    return models.Tasks.find(filter).countDocuments();
  },

  async compareNextStageTask(
    stage: IStageDocument,
    _args,
    { models: { Stages } }: IContext,
  ) {
    const result: { count?: number; percent?: number } = {};

    const { order = 1 } = stage;

    const filter = {
      order: { $in: [order, order + 1] },
      probability: { $ne: 'Lost' },
      pipelineId: stage.pipelineId,
    };

    const stages = await Stages.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'tasks',
          let: { stageId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$stageId', '$$stageId'] },
                    { $ne: ['$status', TASK_STATUSES.ARCHIVED] },
                  ],
                },
              },
            },
          ],
          as: 'currentTasks',
        },
      },
      {
        $lookup: {
          from: 'tasks',
          let: { stageId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$initialStageId', '$$stageId'] },
                    { $ne: ['$status', TASK_STATUSES.ARCHIVED] },
                  ],
                },
              },
            },
          ],
          as: 'initialTasks',
        },
      },
      {
        $project: {
          order: 1,
          currentTaskCount: { $size: '$currentTasks' },
          initialTaskCount: { $size: '$initialTasks' },
        },
      },
      { $sort: { order: 1 } },
    ]);

    if (stages.length === 2) {
      const [first, second] = stages;
      result.count = first.currentTaskCount - second.currentTaskCount;
      result.percent = (second.initialTaskCount * 100) / first.initialTaskCount;
    }

    return result;
  },
};
