import { IModels } from '~/connectionResolvers';
import {resetConfigsCache } from './commonUtils';

export const updateConfigs = async (
  models: IModels,
  configsMap
): Promise<void> => {
//   await models.Configs.updateConfigs(configsMap);

  await resetConfigsCache();
};

export const repairIntegrations = async (
  subdomain: string,
  models: IModels,
  integrationId: string
): Promise<true | Error> => {

  return true;
};