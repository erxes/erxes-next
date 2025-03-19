import { IEmailTemplateDocument } from 'erxes-api-utils';
import { IContext } from 'backend/core-api/src/connectionResolvers';
export default {
  /* created user of an email template */
  async createdUser(
    emailTemplate: IEmailTemplateDocument,
    _params,
    { models }: IContext,
  ) {
    // return models.Users.findOne({ _id: emailTemplate.createdBy });
  },
};
