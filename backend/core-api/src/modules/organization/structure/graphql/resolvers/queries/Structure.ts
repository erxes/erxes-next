import { IContext } from '~/connectionResolvers';

export const structuresQueries = {
  async structureDetail(_root, _args: undefined, { models }: IContext) {
    return models.Structures.findOne();
  },
};
