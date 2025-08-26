import { IContext } from '~/connectionResolvers';
import { IProjectFilter } from '@/project/@types/project';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IProjectDocument } from '@/project/@types/project';
import { FilterQuery } from 'mongoose';
import { STATUS_TYPES } from '@/status/constants';
import {
  fillMissingDays,
  fillUntilTargetDate,
  fillFromLastDate,
} from '@/project/utils/charUtils';
import { differenceInCalendarDays } from 'date-fns';

export const projectQueries = {
  getProject: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Project.getProject(_id);
  },

  getProjects: async (
    _parent: undefined,
    { filter }: { filter: IProjectFilter },
    { models }: IContext,
  ) => {
    const filterQuery: FilterQuery<IProjectDocument> = {};

    if (filter.name) {
      filterQuery.name = { $regex: filter.name, $options: 'i' };
    }

    if (filter.status) {
      filterQuery.status = filter.status;
    }

    if (filter.priority) {
      filterQuery.priority = filter.priority;
    }

    if (filter.startDate) {
      filterQuery.startDate = { $gte: filter.startDate };
    }

    if (filter.targetDate) {
      filterQuery.targetDate = { $gte: filter.targetDate };
    }

    if (filter.leadId) {
      filterQuery.leadId = filter.leadId;
    }

    if (filter.teamIds && filter.teamIds.length > 0) {
      filterQuery.teamIds = { $in: filter.teamIds };
    }

    if (
      (filter.teamIds && filter.teamIds.length <= 0 && filter.userId) ||
      !filter.teamIds
    ) {
      const teamIds = await models.TeamMember.find({
        memberId: filter.userId,
      }).distinct('teamId');

      filterQuery.teamIds = { $in: teamIds };
    }

    const { list, totalCount, pageInfo } =
      await cursorPaginate<IProjectDocument>({
        model: models.Project,
        limit: filter.limit || 20,
        cursor: filter.cursor || undefined,
        direction: filter.direction || 'forward',
        sortBy: {
          createdAt: 'desc',
        },
        filter: filterQuery,
      });

    return { list, totalCount, pageInfo };
  },

  getProjectProgress: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    const teamIds = await models.Project.findOne({ _id }).distinct('teamIds');

    const startedStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.STARTED] },
    }).distinct('_id');

    const completedStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.COMPLETED] },
    }).distinct('_id');

    const canceledStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.CANCELLED] },
    }).distinct('_id');

    const result = await models.Task.aggregate([
      {
        $match: {
          projectId: _id,
        },
      },
      {
        $facet: {
          totalScope: [
            { $match: { status: { $nin: canceledStatusIds } } },
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
            { $match: { status: { $in: startedStatusIds } } },
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
            { $match: { status: { $in: completedStatusIds } } },
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

  getProjectProgressByMember: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    const teamIds = await models.Project.findOne({ _id }).distinct('teamIds');

    const startedStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.STARTED] },
    }).distinct('_id');

    const completedStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.COMPLETED] },
    }).distinct('_id');

    const canceledStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.CANCELLED] },
    }).distinct('_id');

    return models.Task.aggregate([
      {
        $match: {
          projectId: _id,
        },
      },
      {
        $facet: {
          totalScope: [
            { $match: { status: { $nin: canceledStatusIds } } },
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
            { $match: { status: { $in: startedStatusIds } } },
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
            { $match: { status: { $in: completedStatusIds } } },
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

  getProjectProgressByTeam: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    const teamIds = await models.Project.findOne({ _id }).distinct('teamIds');

    const startedStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.STARTED] },
    }).distinct('_id');

    const completedStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.COMPLETED] },
    }).distinct('_id');

    const canceledStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.CANCELLED] },
    }).distinct('_id');

    return models.Task.aggregate([
      {
        $match: {
          projectId: _id,
        },
      },
      {
        $facet: {
          totalScope: [
            { $match: { status: { $nin: canceledStatusIds } } },
            {
              $group: {
                _id: '$teamId',
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
            { $match: { status: { $in: startedStatusIds } } },
            {
              $group: {
                _id: '$teamId',
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
            { $match: { status: { $in: completedStatusIds } } },
            {
              $group: {
                _id: '$teamId',
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
                teamId: '$$ts._id',
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

  getProjectProgressChart: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    const project = await models.Project.findOne({ _id });

    if (!project) {
      return [];
    }

    const teamIds = project?.teamIds || [];

    const startedStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.STARTED] },
    }).distinct('_id');

    const completedStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.COMPLETED] },
    }).distinct('_id');

    const canceledStatusIds = await models.Status.find({
      teamId: { $in: teamIds },
      type: { $in: [STATUS_TYPES.CANCELLED] },
    }).distinct('_id');

    const [totalScopeResult] = await models.Task.aggregate([
      {
        $match: { projectId: _id },
      },
      {
        $match: { status: { $nin: canceledStatusIds } },
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
          projectId: _id,
          status: { $in: [...startedStatusIds, ...completedStatusIds] },
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
          isStarted: { $in: ['$status', startedStatusIds] },
          isCompleted: { $in: ['$status', completedStatusIds] },
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

    const baseDate = project.startDate || project.createdAt;

    if (chartDataAggregation && chartDataAggregation.length === 0) {
      let totalDays = 7;
      if (
        project.targetDate &&
        new Date(baseDate) < new Date(project.targetDate)
      ) {
        totalDays = differenceInCalendarDays(
          new Date(project.targetDate),
          baseDate,
        );
      }
      chartData.chartData = fillMissingDays([], baseDate, totalDays);
    }
    if (
      chartDataAggregation.length > 0 &&
      project.targetDate &&
      !project.startDate
    ) {
      const targetDate = new Date(project.targetDate);
      const lastDataDate = new Date(
        chartDataAggregation[chartDataAggregation.length - 1].date,
      );

      if (targetDate < lastDataDate) {
        if (chartDataAggregation.length < 7) {
          chartData.chartData = fillMissingDays(
            chartDataAggregation,
            baseDate,
            7,
          );
        }

        chartData.chartData = chartDataAggregation;
        return chartData;
      }

      chartData.chartData = fillUntilTargetDate(
        chartDataAggregation,
        targetDate,
      );
      return chartData;
    }
    if (chartDataAggregation.length > 0 && project.startDate) {
      const startDate = new Date(project.startDate);
      const firstDate = new Date(chartDataAggregation[0].date);
      let totalDays = 7;

      if (startDate < firstDate && !project.targetDate) {
        totalDays = differenceInCalendarDays(firstDate, startDate);

        chartData.chartData = fillMissingDays(
          chartDataAggregation,
          startDate,
          totalDays,
        );
        return chartData;
      } else if (startDate < firstDate && project.targetDate) {
        const targetDate = new Date(project.targetDate);
        const lastDataDate = new Date(
          chartDataAggregation[chartDataAggregation.length - 1].date,
        );
        totalDays = 7;

        if (lastDataDate > targetDate) {
          totalDays = differenceInCalendarDays(lastDataDate, startDate);
        } else {
          totalDays = differenceInCalendarDays(targetDate, startDate);
        }

        chartData.chartData = fillMissingDays(
          chartDataAggregation,
          startDate,
          totalDays,
        );
        return chartData;
      }
    }
    if (chartDataAggregation.length > 0 && chartDataAggregation.length < 7) {
      chartData.chartData = fillFromLastDate(chartDataAggregation, 7);

      return chartData;
    }

    return chartData;
  },
};
