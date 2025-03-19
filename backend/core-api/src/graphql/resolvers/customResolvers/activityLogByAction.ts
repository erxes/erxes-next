import { IActivityLogDocument } from 'erxes-api-utils';
import { IContext } from 'backend/core-api/src/connectionResolvers';
export default {
  async createdUser(
    activityLog: IActivityLogDocument,
    _,
    { models }: IContext,
  ) {
    // return models.Users.findOne({ _id: activityLog.createdBy });
  },

  async contentTypeDetail(
    activityLog: IActivityLogDocument,
    _,
    { subdomain }: IContext,
  ) {
    // return getContentTypeDetail(subdomain, activityLog);
  },
};
