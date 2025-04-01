import { IContext } from '../../../../../../connectionResolvers';
export const structuresQueries = {
  async structureDetail(_root, _args, { models }: IContext) {
    return models.Structures.findOne();
  },
};
