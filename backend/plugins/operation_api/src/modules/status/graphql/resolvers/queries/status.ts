import { IContext } from '~/connectionResolvers';
import { IStatusFilter } from '~/modules/status/@types/status';

export const statusQueries = {
  getStatus: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Status.getStatus(_id);
  },

  getStatusesByTeam: async (
    _parent: undefined,
    params: IStatusFilter,
    { models }: IContext,
  ) => {
    return models.Status.getStatuses(params);
  },

  getStatusesByType: async (
    _parent: undefined,
    params: IStatusFilter,
    { models }: IContext,
  ) => {
    return models.Status.getStatuses(params);
  },
};
