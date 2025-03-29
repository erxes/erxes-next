import { IContext } from '../../../../@types';

export const authQueries = {
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
