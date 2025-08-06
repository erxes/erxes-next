import { IContext } from '~/connectionResolvers';
import { IStatusFilter } from '@/status/@types/status';
import { STATUS_TYPES } from '@/status/constants';

export const statusQueries = {
  getStatus: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Status.getStatus(_id);
  },

  getStatusesByTeam: async (
    _parent: undefined,
    { teamId }: IStatusFilter,
    { models }: IContext,
  ) => {
    const statuses = Object.values(STATUS_TYPES).map((type) => {
      return models.Status.getStatuses(teamId, type);
    });

    return statuses;
  },

  getStatusesByType: async (
    _parent: undefined,
    { teamId, type }: IStatusFilter,
    { models }: IContext,
  ) => {
    return models.Status.getStatuses(teamId, type);
  },
};
