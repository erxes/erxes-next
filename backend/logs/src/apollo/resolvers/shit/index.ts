import { IContext } from 'backend/logs/src/db/connectionResolvers';
import { ILogDocument } from 'backend/logs/src/db/definitions/logs';
import { coreClient } from 'backend/logs/src/trpc/clients';

export default {
  __resolveReference({ _id }: ILogDocument, { models }: IContext) {
    return models.Logs.findOne({ _id });
  },
  async user({ userId }: ILogDocument, {}, { models }: IContext) {
    return { email: 'admin@erxes.io' };
    // return await models.Users.findOne({ _id: userId })
    //   .lean()
    //   .catch(err => console.log(err.meesage));
  },
};
