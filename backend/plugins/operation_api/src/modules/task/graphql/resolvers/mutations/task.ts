import { IContext } from '~/connectionResolvers';
import { ITaskUpdate } from '@/task/@types/task';

export const taskMutations = {
  createTask: async (
    _parent: undefined,
    params: ITaskUpdate,
    { models, user }: IContext,
  ) => {
    params.createdBy = user._id;
    return models.Task.createTask(params);
  },

  updateTask: async (
    _parent: undefined,
    params: ITaskUpdate,
    { models, user }: IContext,
  ) => {
    return models.Task.updateTask({ doc: params, userId: user._id });
  },

  removeTask: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Task.removeTask(_id);
  },
};
