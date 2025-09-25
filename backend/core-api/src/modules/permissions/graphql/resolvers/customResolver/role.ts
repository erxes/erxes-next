import { IPermissionDocument } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';

export default {
  __resolveReference: async (
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Permissions.getPermission(_id);
  },

  user: async (permission: IPermissionDocument) => {
    if (!permission.userId) {
      return;
    }

    return { __typename: 'User', _id: permission.userId };
  },
};
