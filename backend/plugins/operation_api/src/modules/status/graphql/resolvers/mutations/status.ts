import { IContext } from '~/connectionResolvers';
import { IStatus, IStatusEditInput } from '~/modules/status/@types/status';

export const statusMutations = {
  createStatus: async (
    _parent: undefined,
    params: IStatus,
    { models }: IContext,
  ) => {
    return models.Status.createStatus(params);
  },

  updateStatus: async (
    _parent: undefined,
    { _id, ...params }: IStatusEditInput,
    { models }: IContext,
  ) => {
    return models.Status.updateStatus(_id, params);
  },

  removeStatus: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Status.removeStatus(_id);
  },
};
