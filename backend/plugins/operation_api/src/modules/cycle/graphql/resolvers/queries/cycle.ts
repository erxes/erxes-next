import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ICycleDocument } from '@/cycle/types';
import { STATUS_TYPES } from '@/status/constants/types';

import {
  getCycleProgressByMember,
  getCycleProgressByProject,
  getCycleProgressChart,
  getCyclesProgress,
} from '~/modules/cycle/utils';

export const cycleQueries = {
  getCycle: async (_parent: undefined, { _id }, { models }: IContext) => {
    const cycle = await models.Cycle.getCycle(_id);
    return cycle;
  },
  getCycles: async (_parent: undefined, params, { models }: IContext) => {
    const { list, totalCount, pageInfo } = await cursorPaginate<ICycleDocument>(
      {
        model: models.Cycle,
        params: {
          ...params,
          orderBy: { isActive: -1, isCompleted: 1, startDate: 1 },
        },
        query: { teamId: params.teamId },
      },
    );

    return { list, totalCount, pageInfo };
  },

  getCyclesActive: async (_parent: undefined, params, { models }: IContext) => {
    if (params.taskId) {
      const task = await models.Task.findOne({
        _id: params.taskId,
        statusType: STATUS_TYPES.COMPLETED,
        cycleId: { $ne: null },
      });

      params.cycleId = task?.cycleId;
    }

    const { list, totalCount, pageInfo } = await cursorPaginate<ICycleDocument>(
      {
        model: models.Cycle,
        params: {
          ...params,
          orderBy: {
            isActive: -1,
            isCompleted: 1,
            startDate: 1,
          },
        },

        query: {
          teamId: params.teamId,

          $or: [
            { isActive: true },
            { isCompleted: false },
            { _id: params?.cycleId || null },
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
    return getCyclesProgress(_id, models);
  },

  getCycleProgressChart: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return getCycleProgressChart(_id, models);
  },

  getCycleProgressByMember: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return getCycleProgressByMember(_id, models);
  },

  getCycleProgressByProject: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return getCycleProgressByProject(_id, models);
  },
};
