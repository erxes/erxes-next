import { IContext } from '~/connectionResolvers';
import { repairIntegrations, updateConfigs } from '../../helpers';


export const facebookMutations = {
  async facebookUpdateConfigs(_root, { configsMap }, { models }: IContext) {
    await updateConfigs(models, configsMap);

    return { status: 'ok' };
  },
  async facebookRepair(
    _root,
    { _id }: { _id: string },
    { subdomain, models }: IContext,
  ) {
    await repairIntegrations(subdomain, models, _id);

    return 'success';
  },


};
