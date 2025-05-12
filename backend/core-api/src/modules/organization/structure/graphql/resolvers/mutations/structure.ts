import { IContext } from '~/connectionResolvers';
export const structuresMutations = {
  async structuresAdd(_root: undefined, doc, { user, models }: IContext) {
    const structure = await models.Structures.createStructure(doc, user);

    return structure;
  },

  async structuresEdit(
    _root: undefined,
    { _id, ...doc },
    { user, models }: IContext,
  ) {
    const structure = await models.Structures.updateStructure(_id, doc, user);

    return structure;
  },

  async structuresRemove(_root: undefined, { _id }, { models }: IContext) {
    const deleteResponse = await models.Structures.removeStructure(_id);

    return deleteResponse;
  },
};
