import { Resolver } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';

export const authQueries: Record<string, Resolver> = {
  /**
   * Current user
   */
  async currentUser(
    _parent: undefined,
    _args: undefined,
    { user, models }: IContext,
  ) {
    const result = user
      ? await models.Users.findOne({ _id: user._id, isActive: { $ne: false } })
      : null;

    return result;
  },
};

authQueries.currentUser.metadata = { public: true };
