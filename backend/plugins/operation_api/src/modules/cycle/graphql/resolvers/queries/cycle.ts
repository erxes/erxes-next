import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ICycleDocument } from '~/modules/cycle/types';

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
};
