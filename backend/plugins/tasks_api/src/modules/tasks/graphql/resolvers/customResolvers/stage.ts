import mongoose from "mongoose";
import { IContext } from "~/connectionResolvers";
import { IStageDocument } from "~/modules/tasks/@types/stage";
import { BOARD_STATUSES, BOARD_TYPES, VISIBILITIES } from "~/modules/tasks/constants";
import { generateDealCommonFilters, generateTaskCommonFilters } from "~/modules/tasks/utils";

type AmountsMap = Record<string, number>;

const getAmountsMap = async (
  models: IContext["models"],
  collection: any,
  user: any,
  args: any,
  stage: IStageDocument,
  tickUsed = true
): Promise<AmountsMap> => {
  const amountsMap: AmountsMap = {};

  const filter = await generateDealCommonFilters(
    models,
    user._id,
    { ...args, stageId: stage._id, pipelineId: stage.pipelineId },
    args.extraParams
  );

  const amountList = await collection.aggregate([
    { $match: filter },
    { $unwind: "$productsData" },
    {
      $project: {
        amount: "$productsData.amount",
        currency: "$productsData.currency",
        tickUsed: "$productsData.tickUsed"
      }
    },
    { $match: { tickUsed } },
    {
      $group: {
        _id: "$currency",
        amount: { $sum: "$amount" }
      }
    }
  ]);

  for (const item of amountList) {
    if (item._id) {
      amountsMap[item._id] = item.amount;
    }
  }

  return amountsMap;
};

export default {
  async __resolveReference({ _id }: { _id: string }, { models }: IContext) {
    return models.Stages.findOne({ _id });
  },

  members(stage: IStageDocument) {
    if (stage.visibility === VISIBILITIES.PRIVATE && Array.isArray(stage.memberIds)) {
      return stage.memberIds.map(memberId => ({
        __typename: "User",
        _id: memberId
      }));
    }
    return [];
  },

  async unUsedAmount(
    stage: IStageDocument,
    _args: unknown,
    { user, models }: IContext,
    { variableValues: args }: any
  ): Promise<AmountsMap> {
    if (stage.type === BOARD_TYPES.TICKET) {
      return await getAmountsMap(models, models.Tasks, user, args, stage, false);
    }
    return {};
  },

  async amount(
    stage: IStageDocument,
    _args: unknown,
    { user, models }: IContext,
    { variableValues: args }: any
  ): Promise<AmountsMap> {
    if (stage.type === BOARD_TYPES.TICKET) {
      return await getAmountsMap(models, models.Tasks, user, args, stage, true);
    }
    return {};
  },

  async itemsTotalCount(
    stage: IStageDocument,
    _args: unknown,
    { user, models }: IContext,
    { variableValues: args }: any
  ): Promise<number | null> {
    if (stage.type !== BOARD_TYPES.TICKET) return null;

    const filter = await generateTaskCommonFilters(
      models,
      user._id,
      { ...args, stageId: stage._id, pipelineId: stage.pipelineId },
      args.extraParams
    );

    return models.Tasks.countDocuments(filter);
  },

  async initialTaskTotalCount(
    stage: IStageDocument,
    _args: unknown,
    { user, models }: IContext,
    { variableValues: args }: any
  ): Promise<number> {
    const filter = await generateTaskCommonFilters(
      models,
      user._id,
      { ...args, initialStageId: stage._id },
      args.extraParams
    );
    return models.Tasks.countDocuments(filter);
  },

  async inProcessTasksTotalCount(
    stage: IStageDocument,
    _args: unknown,
    { models: { Stages } }: IContext
  ): Promise<number> {
    const pipeline = [
      {
        $match: {
          pipelineId: stage.pipelineId,
          probability: { $ne: "Lost" },
          _id: { $ne: stage._id }
        }
      },
      {
        $lookup: {
          from: "tasks",
          let: { stageId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$stageId", "$$stageId"] },
                    { $ne: ["$status", BOARD_STATUSES.ARCHIVED] }
                  ]
                }
              }
            }
          ],
          as: "tasks"
        }
      },
      { $unwind: "$tasks" },
      {
        $match: {
          "tasks.initialStageId": stage._id
        }
      }
    ];

    const results = await Stages.aggregate(pipeline);
    return results.length;
  },

  async stayedTasksTotalCount(
    stage: IStageDocument,
    _args: unknown,
    { user, models }: IContext,
    { variableValues: args }: any
  ): Promise<number> {
    const filter = await generateTaskCommonFilters(
      models,
      user._id,
      {
        ...args,
        initialStageId: stage._id,
        stageId: stage._id,
        pipelineId: stage.pipelineId
      },
      args.extraParams
    );

    return models.Tasks.countDocuments(filter);
  },

  async compareNextStageTask(
    stage: IStageDocument,
    _args: unknown,
    { models: { Stages } }: IContext
  ): Promise<{ count?: number; percent?: number }> {
    const result: { count?: number; percent?: number } = {};
    const order = stage.order ?? 1;

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: {
          order: { $in: [order, order + 1] },
          probability: { $ne: "Lost" },
          pipelineId: stage.pipelineId
        }
      },
      {
        $lookup: {
          from: "tasks",
          let: { stageId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$stageId", "$$stageId"] },
                    { $ne: ["$status", BOARD_STATUSES.ARCHIVED] }
                  ]
                }
              }
            }
          ],
          as: "currentTasks"
        }
      },
      {
        $lookup: {
          from: "tasks",
          let: { stageId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$initialStageId", "$$stageId"] },
                    { $ne: ["$status", BOARD_STATUSES.ARCHIVED] }
                  ]
                }
              }
            }
          ],
          as: "initialTasks"
        }
      },
      {
        $project: {
          order: 1,
          currentTaskCount: { $size: "$currentTasks" },
          initialTaskCount: { $size: "$initialTasks" }
        }
      },
      { $sort: { order: 1 } }
    ];

    const stages = await Stages.aggregate(pipeline);

    if (stages.length === 2) {
      const [first, second] = stages;
      result.count = first.currentTaskCount - second.currentTaskCount;

      if (first.initialTaskCount) {
        result.percent = (second.initialTaskCount * 100) / first.initialTaskCount;
      }
    }

    return result;
  }
};