import { IContext } from '~/connectionResolvers';
import { IProjectFilter } from '@/project/@types/project';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IProjectDocument } from '@/project/@types/project';
import { FilterQuery } from 'mongoose';
import { STATUS_TYPES } from '@/status/constants';

export const projectQueries = {
  getProject: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Project.getProject(_id);
  },

  getProjects: async (
    _parent: undefined,
    params: IProjectFilter,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<IProjectDocument> = {};

    if (params.name) {
      filter.name = { $regex: params.name, $options: 'i' };
    }

    if (params.status) {
      filter.status = params.status;
    }

    if (params.priority) {
      filter.priority = params.priority;
    }

    if (params.startDate) {
      filter.startDate = { $gte: params.startDate };
    }

    if (params.targetDate) {
      filter.targetDate = { $gte: params.targetDate };
    }

    if (params.leadId) {
      filter.leadId = params.leadId;
    }

    if (params.teamIds && params.teamIds.length > 0) {
      filter.teamIds = { $in: params.teamIds };
    }

    if (
      (params.teamIds && params.teamIds.length <= 0 && params.userId) ||
      !params.teamIds
    ) {
      const teamIds = await models.TeamMember.find({
        memberId: params.userId,
      }).distinct('teamId');

      filter.teamIds = { $in: teamIds };
    }

    const { list, totalCount, pageInfo } =
      await cursorPaginate<IProjectDocument>({
        model: models.Project,
        params,
        query: filter,
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

    const result = await models.Task.aggregate([
      {
        $match: {
          projectId: _id,
          status: { $in: [...startedStatusIds, ...completedStatusIds] }, // filter all relevant statuses
        },
      },
      {
        $facet: {
          totalScope: [
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
                      1,
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

    return result;
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

    const result = await models.Task.aggregate([
      {
        $match: {
          projectId: _id,
          status: { $in: [...startedStatusIds, ...completedStatusIds] },
        },
      },
      {
        $facet: {
          totalScope: [
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

    return result;
  },
};
