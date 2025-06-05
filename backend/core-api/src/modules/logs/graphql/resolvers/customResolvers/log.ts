import { ILogDocument } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';

export default {
  __resolveReference({ _id }: ILogDocument, { models }: IContext) {
    return models.Logs.findOne({ _id });
  },
  async user({ userId }: ILogDocument, {}, {}: IContext) {
    if (!userId) return null;

    return {
      __typename: 'User',
      _id: userId,
    };
  },
};
