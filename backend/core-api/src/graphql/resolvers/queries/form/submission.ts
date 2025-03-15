import { IContext } from 'backend/core-api/src/connectionResolvers';
import { IFormSubmissionFilter } from 'backend/core-api/src/modules/form/types';

export default {
  async formSubmissions(
    _root,
    {
      formId,
      page,
      perPage,
    }: {
      formId: string;
      tagId: string;
      contentTypeIds: string[];
      customerId: string;
      filters: IFormSubmissionFilter[];
      page: number;
      perPage: number;
    },
    { models }: IContext,
  ) {
    try {
      // Calculate pagination params
      const skip = (page - 1) * perPage;

      // Fetch grouped submissions by groupId, with pagination
      const submissions = await models.FormSubmissions.aggregate([
        { $match: { formId } }, // Match submissions by formId
        {
          $group: {
            _id: '$groupId', // Group by groupId (unique per user submission group)
            submissions: {
              $push: {
                _id: '$_id',
                formId: '$formId',
                formFieldId: '$formFieldId',
                text: '$text',
                formFieldText: '$formFieldText',
                value: '$value',
                submittedAt: '$submittedAt',
              },
            },
            customerId: { $first: '$customerId' }, // Take the first customerId in the group
            contentTypeId: { $first: '$contentTypeId' }, // Take the first contentTypeId
            createdAt: { $first: '$submittedAt' }, // Take the earliest submission date
            customFieldsData: { $first: '$customFieldsData' }, // First customFieldsData
          },
        },
        { $skip: skip }, // Skip for pagination
        { $limit: perPage }, // Limit for pagination
      ]);

      // Return single submission per groupId
      return submissions.map((submission) => ({
        _id: submission._id, // The groupId is used as the _id
        contentTypeId: submission._id,
        customerId: submission.customerId,
        // Assuming Customer schema
        createdAt: submission.createdAt,
        customFieldsData: submission.customFieldsData,
        submissions: submission.submissions, // All grouped form submissions
      }));
    } catch (error) {
      throw new Error('Error fetching form submissions');
    }
  },

  async formSubmissionsTotalCount(
    _root,
    {
      formId,
    }: {
      formId: string;
      tagId: string;
      contentTypeIds: string[];
      customerId: string;
      filters: IFormSubmissionFilter[];
    },
    { models }: IContext,
  ) {
    const result = await models.FormSubmissions.aggregate([
      // Step 1: Filter submissions with contentType "lead"
      {
        $match: {
          formId,
        },
      },
      // Step 2: Group by both groupId and customerId to get unique submissions per user
      {
        $group: {
          _id: {
            groupId: '$groupId', // Group by groupId // Ensure unique by customerId (user)
          },
        },
      },
      // Step 3: Group by groupId to count unique submissions
      {
        $count: 'totalUniqueCount', // Return the total number of unique submissions
      },
    ]);

    return result[0].totalUniqueCount;
  },

  formSubmissionDetail: async (_root, params, { models }: IContext) => {
    const { contentTypeId } = params;

    const submissions = await models.FormSubmissions.find({
      contentTypeId,
    }).lean();

    return {
      submissions,
    };
  },
};
