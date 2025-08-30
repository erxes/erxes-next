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
    const result = await models.Task.aggregate([
      {
        $match: {
          cycleId: _id,
        },
      },
      {
        $facet: {
          totalScope: [
            { $match: { statusType: { $ne: STATUS_TYPES.CANCELLED } } },
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
          ],
          started: [
            { $match: { statusType: STATUS_TYPES.STARTED } },
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
          ],
          completed: [
            { $match: { statusType: STATUS_TYPES.COMPLETED } },
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
          ],
        },
      },
      {
        $project: {
          totalScope: {
            $ifNull: [{ $arrayElemAt: ['$totalScope.totalScope', 0] }, 0],
          },
          totalStartedScope: {
            $ifNull: [{ $arrayElemAt: ['$started.totalScope', 0] }, 0],
          },
          totalCompletedScope: {
            $ifNull: [{ $arrayElemAt: ['$completed.totalScope', 0] }, 0],
          },
        },
      },
    ]);

    return result?.[0] || {};
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
    return models.Task.aggregate([
      {
        $match: {
          cycleId: _id,
        },
      },
      {
        $facet: {
          totalScope: [
            { $match: { statusType: { $ne: STATUS_TYPES.CANCELLED } } },
            {
              $group: {
                _id: '$assigneeId',
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
          ],
          started: [
            { $match: { statusType: STATUS_TYPES.STARTED } },
            {
              $group: {
                _id: '$assigneeId',
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
          ],
          completed: [
            { $match: { statusType: STATUS_TYPES.COMPLETED } },
            {
              $group: {
                _id: '$assigneeId',
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
          ],
        },
      },
      {
        $project: {
          merged: {
            $map: {
              input: '$totalScope',
              as: 'ts',
              in: {
                assigneeId: '$$ts._id',
                totalScope: '$$ts.totalScope',
                totalStartedScope: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$started',
                              as: 'st',
                              cond: { $eq: ['$$st._id', '$$ts._id'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ['$$match.totalScope', 0] },
                  },
                },
                totalCompletedScope: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$completed',
                              as: 'cm',
                              cond: { $eq: ['$$cm._id', '$$ts._id'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ['$$match.totalScope', 0] },
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: '$merged' },
      { $replaceRoot: { newRoot: '$merged' } },
      { $sort: { totalScope: -1 } },
    ]);
  },

  getCycleProgressByProject: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Task.aggregate([
      {
        $match: {
          cycleId: _id,
          projectId: { $exists: true },
        },
      },
      {
        $facet: {
          totalScope: [
            { $match: { statusType: { $ne: STATUS_TYPES.CANCELLED } } },
            {
              $group: {
                _id: '$projectId',
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
          ],
          started: [
            { $match: { statusType: STATUS_TYPES.STARTED } },
            {
              $group: {
                _id: '$projectId',
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
          ],
          completed: [
            { $match: { statusType: STATUS_TYPES.COMPLETED } },
            {
              $group: {
                _id: '$projectId',
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
          ],
        },
      },
      {
        $project: {
          merged: {
            $map: {
              input: '$totalScope',
              as: 'ts',
              in: {
                projectId: '$$ts._id',
                totalScope: '$$ts.totalScope',
                totalStartedScope: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$started',
                              as: 'st',
                              cond: { $eq: ['$$st._id', '$$ts._id'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ['$$match.totalScope', 0] },
                  },
                },
                totalCompletedScope: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$completed',
                              as: 'cm',
                              cond: { $eq: ['$$cm._id', '$$ts._id'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ['$$match.totalScope', 0] },
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: '$merged' },
      { $replaceRoot: { newRoot: '$merged' } },
      { $sort: { totalScope: -1 } },
    ]);
  },
};
