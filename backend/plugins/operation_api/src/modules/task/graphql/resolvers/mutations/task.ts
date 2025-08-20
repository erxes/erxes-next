import { IContext } from '~/connectionResolvers';
import { ITaskUpdate } from '@/task/@types/task';
import { graphqlPubsub } from 'erxes-api-shared/utils';

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
    const updateTasked = await models.Task.updateTask({
      doc: params,
      userId: user._id,
    });

    await graphqlPubsub.publish(`operationTaskChanged:${updateTasked._id}`, {
      operationTaskChanged: updateTasked,
    });

    return updateTasked;
  },

  removeTask: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Task.removeTask(_id);
  },
};
