import { IContext } from '~/connectionResolvers';

export const taskMutations = {
  createTask: async (_parent: undefined, { name }, { models }: IContext) => {
    return models.Task.createTask({ name });
  },

  updateTask: async (
    _parent: undefined,
    { _id, name },
    { models }: IContext,
  ) => {
    return models.Task.updateTask(_id, { name });
  },

  removeTask: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Task.removeTask(_id);
  },
};
