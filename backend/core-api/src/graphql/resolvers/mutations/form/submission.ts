import { IContext } from 'backend/core-api/src/connectionResolvers';

export default {
  /**
   * Create a form submission data
   */
  async formSubmissionsSave(
    _root,
    {
      formId,
      contentTypeId,
      contentType,
      formSubmissions,
      userId,
    }: {
      contentType: string;
      contentTypeId: string;
      formSubmissions: { [key: string]: JSON };
      formId: string;
      userId?: string;
    },
    { models }: IContext,
  ) {
    const cleanedFormSubmissions = await models.Fields.cleanMulti(
      formSubmissions || {},
    );

    for (const formFieldId of Object.keys(cleanedFormSubmissions)) {
      const formSubmission = await models.FormSubmissions.findOne({
        contentTypeId,
        contentType,
        formFieldId,
      });

      if (formSubmission) {
        formSubmission.value = cleanedFormSubmissions[formFieldId];

        formSubmission.save();
      } else {
        const doc = {
          contentTypeId,
          contentType,
          formFieldId,
          formId,
          userId,
          value: formSubmissions[formFieldId],
        };

        models.FormSubmissions.createFormSubmission(doc);
      }
    }

    return true;
  },

  formSubmissionsEdit: async (_root, params, { models }: IContext) => {
    const { contentTypeId, submissions } = params;

    for (const submission of submissions) {
      const { _id, value } = submission;
      await models.FormSubmissions.updateOne({ _id }, { $set: { value } });
    }

    const formSubmissions = await models.FormSubmissions.find({
      contentTypeId,
    }).lean();

    return {
      submissions: formSubmissions,
    };
  },

  formSubmissionsRemove: async (_root, params, { models }: IContext) => {
    const { customerId, contentTypeId } = params;

    return models.FormSubmissions.deleteOne({ customerId, contentTypeId });
  },
};
