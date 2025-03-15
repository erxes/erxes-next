import { IContext } from 'backend/core-api/src/connectionResolvers';
import { IForm, IFormsEdit } from 'backend/core-api/src/modules/form/types';

export default {
  /**
   * Create a form data
   */
  async formsAdd(_root, doc: IForm, { user, models }: IContext) {
    if (doc.type === 'lead') {
      if (!Object.keys(doc.leadData).length) {
        throw new Error('leadData must be supplied');
      }

      doc.leadData = {
        ...doc.leadData,
        viewCount: 0,
        contactsGathered: 0,
      };
    }

    return models.Forms.createForm(doc, user._id);
  },

  /**
   * Update a form data
   */
  async formsEdit(_root, { _id, ...doc }: IFormsEdit, { models }: IContext) {
    return models.Forms.updateForm(_id, doc);
  },

  /**
   * Duplicate a form
   */
  async formsDuplicate(
    _root,
    { _id }: { _id: string },
    { models, user }: IContext,
  ) {
    const form = await models.Forms.duplicate(_id, user._id);

    return form;
  },

  /**
   * Remove a form
   */
  async formsRemove(_root, { _id }: { _id: string }, { models }: IContext) {
    await models.Fields.deleteMany({ contentTypeId: _id });

    await models.FormSubmissions.deleteMany({ formId: _id });

    return models.Forms.removeForm(_id);
  },

  async formsToggleStatus(
    _root,
    { _id }: { _id: string; status: boolean },
    { models }: IContext,
  ) {
    const form = await models.Forms.getForm(_id);
    const status = form.status === 'active' ? 'archived' : 'active';

    form.status = status;

    form.save();
    return form;
  },
};
