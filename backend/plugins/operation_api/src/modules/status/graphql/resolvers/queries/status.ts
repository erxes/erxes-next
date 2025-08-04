import { IContext } from '~/connectionResolvers';
import { IStatusFilter } from '@/status/@types/status';

export const statusQueries = {
  getStatus: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Status.getStatus(_id);
  },

  getStatusesByTeam: async (
    _parent: undefined,
    { teamId }: IStatusFilter,
    { models }: IContext,
  ) => {
    return models.Status.getStatuses(teamId);
  },

  getStatusesByType: async (
    _parent: undefined,
    { teamId, type }: IStatusFilter,
    { models }: IContext,
  ) => {
    return models.Status.getStatuses(teamId, type);
  },
};
