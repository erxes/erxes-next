import { IContext } from '~/connectionResolvers';
import { IFacebookBotDocument } from '~/modules/integrations/facebook/db/definitions/bots';
import { graphRequest } from '~/modules/integrations/facebook/utils';

export default {
  async account(bot: IFacebookBotDocument, _args, { models }: IContext) {
    console.log({ bot });
    return models.FacebookAccounts.findOne({ _id: bot.accountId }).select({
      name: 1,
    });
  },

  async page(
    { token, pageId }: IFacebookBotDocument,
    _args,
    { models }: IContext,
  ) {
    try {
      const response: any = await graphRequest.get(
        `/${pageId}?fields=name`,
        token,
      );
      return response ? response : null;
    } catch (error) {
      return null;
    }
  },

  async profileUrl({ pageId, token }: IFacebookBotDocument) {
    try {
      const response: any = await graphRequest.get(
        `/${pageId}/picture?height=600`,
        token,
      );

      if (!response) {
        return null;
      }

      return response?.location || null;
    } catch (err) {
      return null;
    }
  },
};
