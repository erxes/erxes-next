import { IContext } from '~/connectionResolvers';
import { IConfig } from '~/modules/config/types';

export const configMutations = {
  createConfig: async (
    _root: undefined,
    args: IConfig,
    { models, user }: IContext,
  ) => {
    const config = await models.Configs.createConfig(args, user);

    return config;
  },
  updateConfig: async (
    _root: undefined,
    args: IConfig & { _id: string },
    { models, user }: IContext,
  ) => {
    const config = await models.Configs.updateConfig(args._id, args, user);

    return config;
  },
  removeConfig: async (
    _root: undefined,
    args: { _id: string },
    { models, user }: IContext,
  ) => {
    const config = await models.Configs.removeConfig(args._id, user);

    return config;
  },
};
