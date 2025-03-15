import { IContext } from 'backend/core-api/src/connectionResolvers';
import branchMutations from './branch';
import departmentMutations from './department';
import unitMutations from './unit';
import positionMutations from './position';

export const structuresMutations = {
  async structuresAdd(_root, doc, { user, models }: IContext) {
    return await models.Structures.createStructure(doc, user);
  },

  async structuresEdit(_root, { _id, ...doc }, { user, models }: IContext) {
    return models.Structures.updateStructure(_id, doc, user);
  },

  async structuresRemove(_root, { _id }, { models }: IContext) {
    return await models.Structures.removeStructure(_id);
  },

  ...branchMutations,
  ...departmentMutations,
  ...unitMutations,
  ...positionMutations,
};
