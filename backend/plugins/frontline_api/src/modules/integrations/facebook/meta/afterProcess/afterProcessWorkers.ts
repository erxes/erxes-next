import { splitType } from 'erxes-api-shared/core-modules';
import { IAfterProcessRule } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { IFacebookIntegrationDocument } from '~/modules/integrations/facebook/@types/integrations';

export const facebookAfterProcessWorkers = {
  rules: [
    {
      type: 'createdDocument',
      contentTypes: ['frontline:facebook.integrations'],
    },
  ] as IAfterProcessRule[],
  onDocumentCreated: async (
    models: IModels,
    collectionType: 'integrations',
    data: { contentType: string; fullDocument: IFacebookIntegrationDocument },
  ) => {
    const fullDocument = data?.fullDocument || {};

    if (collectionType === 'integrations') {
      const {
        facebookPageIds = [],
        accountId,
        facebookPageTokensMap = {},
      } = fullDocument;
      const bot = await models.FacebookBots.findOne({
        pageId: { $in: facebookPageIds },
      }).lean();
      if (bot && facebookPageTokensMap[bot.pageId]) {
        await models.FacebookBots.updateOne(
          { _id: bot._id },
          {
            $set: {
              accountId: accountId,
              token: facebookPageTokensMap[bot.pageId],
            },
          },
        );
      }
    }
  },
};
