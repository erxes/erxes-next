import { IContext } from '../../../../@types';

export const authQueries = {
  async currentUser(_root, _args, { user, models }: IContext) {
    const result = user
      ? await models.Users.findOne({ _id: user._id, isActive: { $ne: false } })
      : null;

    return result;
  },
};
