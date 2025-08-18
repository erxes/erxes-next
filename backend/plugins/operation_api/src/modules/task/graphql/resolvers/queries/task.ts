import { IContext } from '~/connectionResolvers';
import { ITaskFilter } from '@/task/@types/task';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ITaskDocument } from '@/task/@types/task';
import { FilterQuery } from 'mongoose';

export const taskQueries = {
  getTask: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Task.getTask(_id);
  },

  getTasks: async (
    _parent: undefined,
    params: ITaskFilter,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<ITaskDocument> = {};

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

    if (params.createdAt) {
      filter.createdAt = { $gte: params.createdAt };
    }

    if (params.teamId) {
      filter.teamId = params.teamId;
    }

    if (params.createdBy) {
      filter.createdBy = params.createdBy;
    }

    if (params.assigneeId) {
      filter.assigneeId = params.assigneeId;
    }

    if (params.cycleId) {
      filter.cycleId = params.cycleId;
    }

    if (params.projectId) {
      filter.projectId = params.projectId;
    }

    if (params.estimatePoint) {
      filter.estimatePoint = params.estimatePoint;
    }

    if (params.teamId && params.projectId) {
      delete filter.teamId;
    }

    if (
      params.userId &&
      !params.teamId &&
      !params.assigneeId &&
      !params.projectId
    ) {
      filter.assigneeId = params.userId;
    }

    const { list, totalCount, pageInfo } = await cursorPaginate<ITaskDocument>({
      model: models.Task,
      params: { orderBy: { createdAt: -1 } },
      query: filter,
    });

    return { list, totalCount, pageInfo };
  },
};
