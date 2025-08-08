import { IContext } from '~/connectionResolvers';

export const taskMutations = {
  createTask: async (
    _parent: undefined,
    { name, teamId, status },
    { models, user }: IContext,
  ) => {
    return models.Task.createTask({
      name,
      teamId,
      status,
      createdBy: user._id,
    });
  },

  updateTask: async (
    _parent: undefined,
    { _id, name, teamId, status },
    { models }: IContext,
  ) => {
    return models.Task.updateTask(_id, { name, teamId, status });
  },

  removeTask: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Task.removeTask(_id);
  },
};
