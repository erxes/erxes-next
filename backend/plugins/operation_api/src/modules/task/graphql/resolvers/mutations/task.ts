import { IContext } from '~/connectionResolvers';
import { ITaskUpdate } from '@/task/@types/task';
import { graphqlPubsub } from 'erxes-api-shared/utils';

export const taskMutations = {
  createTask: async (
    _parent: undefined,
    params: ITaskUpdate,
    { models, user, subdomain }: IContext,
  ) => {
    return models.Task.createTask({
      doc: params,
      userId: user._id,
      subdomain,
    });
  },

  updateTask: async (
    _parent: undefined,
    params: ITaskUpdate,
    { models, user, subdomain }: IContext,
  ) => {
    const updateTasked = await models.Task.updateTask({
      doc: params,
      userId: user._id,
      subdomain,
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
