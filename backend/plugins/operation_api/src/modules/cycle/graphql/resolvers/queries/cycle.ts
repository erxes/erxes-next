import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ICycleDocument } from '~/modules/cycle/types';
import { STATUS_TYPES } from '@/status/constants/types';
import { fillMissingDays } from '~/modules/project/utils/charUtils';
import { differenceInCalendarDays } from 'date-fns';

export const cycleQueries = {
  getCycle: async (_parent: undefined, { _id }, { models }: IContext) => {
    const cycle = await models.Cycle.getCycle(_id);
    return cycle;
  },
  getCycles: async (_parent: undefined, params, { models }: IContext) => {
    const { list, totalCount, pageInfo } = await cursorPaginate<ICycleDocument>(
      {
        model: models.Cycle,
        params,
        query: { teamId: params.teamId },
      },
    );

    return { list, totalCount, pageInfo };
  },

  getCyclesActive: async (_parent: undefined, params, { models }: IContext) => {
    const { list, totalCount, pageInfo } = await cursorPaginate<ICycleDocument>(
      {
        model: models.Cycle,
        params,
        query: {
          teamId: params.teamId,
          $or: [
            { isActive: true },
            { isCompleted: false },
            {
              startDate: { $lte: new Date() },
            },
          ],
        },
      },
    );

    return { list, totalCount, pageInfo };
  },

  getCycleProgress: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    const cycle = await models.Cycle.getCycle(_id);
    return cycle;
  },

  getCycleProgressChart: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    const cycle = await models.Cycle.getCycle(_id);

    if (!cycle) {
      return [];
    }

    const [totalScopeResult] = await models.Task.aggregate([
      {
        $match: { cycleId: _id },
      },
      {
        $match: { statusType: { $ne: STATUS_TYPES.CANCELLED } },
      },
      {
        $group: {
          _id: null,
          totalScope: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$estimatePoint', null] },
                    { $eq: ['$estimatePoint', 0] },
                  ],
                },
                1,
                '$estimatePoint',
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalScope: { $ifNull: ['$totalScope', 0] },
        },
      },
    ]);

    const totalScope = totalScopeResult?.totalScope || 0;

    const chartDataAggregation = await models.Task.aggregate([
      {
        $match: {
          cycleId: _id,
          statusType: { $in: [STATUS_TYPES.STARTED, STATUS_TYPES.COMPLETED] },
          statusChangedDate: { $ne: null },
        },
      },
      {
        $addFields: {
          dayDate: {
            $dateFromParts: {
              year: { $year: '$statusChangedDate' },
              month: { $month: '$statusChangedDate' },
              day: { $dayOfMonth: '$statusChangedDate' },
            },
          },
          isStarted: { $eq: ['$statusType', STATUS_TYPES.STARTED] },
          isCompleted: { $eq: ['$statusType', STATUS_TYPES.COMPLETED] },
          estimateValue: {
            $cond: [
              {
                $or: [
                  { $eq: ['$estimatePoint', null] },
                  { $eq: ['$estimatePoint', 0] },
                ],
              },
              1,
              '$estimatePoint',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$dayDate',
          started: { $sum: { $cond: ['$isStarted', '$estimateValue', 0] } },
          completed: { $sum: { $cond: ['$isCompleted', '$estimateValue', 0] } },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$_id' },
          },
          started: 1,
          completed: 1,
        },
      },
    ]);

    const chartData: {
      totalScope: number;
      chartData: { date: Date; started: number; completed: number }[];
    } = {
      totalScope,
      chartData: [],
    };

    chartData.chartData = fillMissingDays(
      chartDataAggregation,
      cycle.startDate,
      differenceInCalendarDays(cycle.endDate, cycle.startDate),
    );

    return chartData;
  },

  getCycleProgressByMember: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    const cycle = await models.Cycle.getCycle(_id);
    return cycle;
  },
};
