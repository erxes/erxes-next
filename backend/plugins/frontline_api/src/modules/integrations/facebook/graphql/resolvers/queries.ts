import { IContext } from '~/connectionResolvers';
import {
  getPageList,
} from '@/integrations/facebook/utils'; 
import {IKind} from '@/integrations/facebook/@types/utils';


export const facebookQueries = {
  async facebookGetAccounts(_root, { kind }: IKind, { models }: IContext) {
    return models.FacebookAccounts.find({ kind });
  },
  async facebookGetPages(_root, args, { models }: IContext) {
    const { kind, accountId } = args;
    const account = await models.FacebookAccounts.getAccount({ _id: accountId });
    const accessToken = account.token;
    let pages: any[] = [];

    try {
      pages = await getPageList(models, accessToken, kind);
    } catch (e) {
      if (!e.message.includes('Application request limit reached')) {
        await models.Integrations.updateOne(
          { accountId },
          { $set: { healthStatus: 'account-token', error: `${e.message}` } }
        );
      }
    }

    return pages;
  },

};
