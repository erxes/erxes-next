import { IContext } from '~/connectionResolvers';
import { IStageDocument } from '~/modules/tickets/@types/stage';
import { TICKET_STATUSES, VISIBILITIES } from '~/modules/tickets/constants';
import { generateFilter } from '~/modules/tickets/graphql/resolvers/queries/ticket';
import { getAmountsMap } from '~/modules/tickets/utils';

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
    _args: undefined,
    { user, models }: IContext,
    { variableValues: args },
  ) {
    return getAmountsMap(models, user, args, stage, false);
  },

  async amount(
    stage: IStageDocument,
    _args: undefined,
    { user, models }: IContext,
    { variableValues: args },
  ) {
    return getAmountsMap(models, user, args, stage);
  },

  async itemsTotalCount(
    stage: IStageDocument,
    _args: undefined,
    { user, models }: IContext,
    { variableValues: args },
  ) {
    const filter = await generateFilter(
      models,
      user._id,
      { ...args, stageId: stage._id, pipelineId: stage.pipelineId },
      args.extraParams,
    );

    return models.Tickets.find(filter).countDocuments();
  },

  /*
   * Total count of ticket that are created on this stage initially
   */
  async initialTicketTotalCount(
    stage: IStageDocument,
    _args: undefined,
    { user, models }: IContext,
    { variableValues: args },
  ) {
    const filter = await generateFilter(
      models,
      user._id,
      { ...args, initialStageId: stage._id },
      args.extraParams,
    );

    return models.Tickets.find(filter).countDocuments();
  },

  /*
   * Total count of tickets that are
   * 1. created on this stage initially
   * 2. moved to other stage which has probability other than Lost
   */
  async inProcessTicketsTotalCount(
    stage: IStageDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    const filter = {
      pipelineId: stage.pipelineId,
      probability: { $ne: 'Lost' },
      _id: { $ne: stage._id },
    };

    const tickets = await models.Stages.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'tickets',
          let: { stageId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$stageId', '$$stageId'] },
                    { $ne: ['$status', TICKET_STATUSES.ARCHIVED] },
                  ],
                },
              },
            },
          ],
          as: 'tickets',
        },
      },
      {
        $project: {
          name: 1,
          tickets: 1,
        },
      },
      {
        $unwind: '$tickets',
      },
      {
        $match: {
          'tickets.initialStageId': stage._id,
        },
      },
    ]);

    return tickets.length;
  },

  async stayedTicketsTotalCount(
    stage: IStageDocument,
    _args: undefined,
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

    return models.Tickets.find(filter).countDocuments();
  },

  async compareNextStageTicket(
    stage: IStageDocument,
    _args: undefined,
    { models }: IContext,
  ) {
    const result: { count?: number; percent?: number } = {};

    const { order = 1 } = stage;

    const filter = {
      order: { $in: [order, order + 1] },
      probability: { $ne: 'Lost' },
      pipelineId: stage.pipelineId,
    };

    const stages = await models.Stages.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'tickets',
          let: { stageId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$stageId', '$$stageId'] },
                    { $ne: ['$status', TICKET_STATUSES.ARCHIVED] },
                  ],
                },
              },
            },
          ],
          as: 'currentTickets',
        },
      },
      {
        $lookup: {
          from: 'tickets',
          let: { stageId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$initialStageId', '$$stageId'] },
                    { $ne: ['$status', TICKET_STATUSES.ARCHIVED] },
                  ],
                },
              },
            },
          ],
          as: 'initialTickets',
        },
      },
      {
        $project: {
          order: 1,
          currentTicketCount: { $size: '$currentTickets' },
          initialTicketCount: { $size: '$initialTickets' },
        },
      },
      { $sort: { order: 1 } },
    ]);

    if (stages.length === 2) {
      const [first, second] = stages;
      result.count = first.currentTicketCount - second.currentTicketCount;
      result.percent =
        (second.initialTicketCount * 100) / first.initialTicketCount;
    }

    return result;
  },
};
