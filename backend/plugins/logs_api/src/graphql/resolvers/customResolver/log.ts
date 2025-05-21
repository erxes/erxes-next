import { IContext } from "~/db/connectionResolvers";
import { ILogDocument } from "~/db/definitions/logs";

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
