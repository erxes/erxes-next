import { IContext } from '~/connectionResolvers';
import { ITaskFilter } from '@/task/@types/task';

export const taskQueries = {
  getTask: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Task.getTask(_id);
  },

  getTasks: async (
    _parent: undefined,
    params: ITaskFilter,
    { models }: IContext,
  ) => {
    return models.Task.getTasks(params);
  },
};
