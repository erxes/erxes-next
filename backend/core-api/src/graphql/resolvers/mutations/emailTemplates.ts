import { IContext } from 'backend/core-api/src/connectionResolvers';
import { IEmailTemplate } from 'erxes-api-utils';
const EMAIL_TEMPLATE = 'emailTemplate';

interface IEmailTemplatesEdit extends IEmailTemplate {
  _id: string;
}

export const emailTemplateMutations = {
  /**
   * Creates a new email template
   */
  async emailTemplatesAdd(
    _root,
    doc: IEmailTemplate,
    { user, docModifier, models, subdomain }: IContext,
  ) {
    const modifiedDoc = docModifier(doc);

    const template = await models.EmailTemplates.createEmailTemplate(
      modifiedDoc,
      user,
    );

    return template;
  },

  /**
   * Update email template
   */
  async emailTemplatesEdit(
    _root,
    { _id, ...fields }: IEmailTemplatesEdit,
    { models, subdomain, user }: IContext,
  ) {
    const template = await models.EmailTemplates.getEmailTemplate(_id);
    const updated = await models.EmailTemplates.updateEmailTemplate(
      _id,
      fields,
    );

    return updated;
  },

  /**
   * Changes the status
   * @param {string} param2._id EmailTemplate id
   * @param {string} param2.status EmailTemplate status
   */
  async emailTemplatesChangeStatus(
    _root,
    { _id, status }: IEmailTemplatesEdit,
    { models, subdomain, user }: IContext,
  ) {
    const emailTemplate = await models.EmailTemplates.getEmailTemplate(_id);

    await models.EmailTemplates.updateOne({ _id }, { $set: { status } });

    const updated = await models.EmailTemplates.findOne({ _id });

    return updated;
  },
  /**
   * Delete email template
   */
  async emailTemplatesRemove(
    _root,
    { _id }: { _id: string },
    { models, subdomain, user }: IContext,
  ) {
    const template = await models.EmailTemplates.getEmailTemplate(_id);
    const removed = await models.EmailTemplates.removeEmailTemplate(_id);

    return removed;
  },

  /**
   * Duplicate an email template
   */
  async emailTemplatesDuplicate(
    _root,
    { _id }: { _id: string },
    { models, user }: IContext,
  ) {
    const template = await models.EmailTemplates.duplicateEmailTemplate(
      _id,
      user,
    );

    return template;
  },
};

export default emailTemplateMutations;
