import { IContext } from '~/connectionResolvers';

export const structuresQueries = {
  async structureDetail(
    _root: undefined,
    _args: undefined,
    { models }: IContext,
  ) {
    return models.Structures.findOne();
  },
};
