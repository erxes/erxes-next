import { IContext } from 'backend/core-api/src/connectionResolvers';

export default {
  async branchesAdd(_root, doc, { user, models }: IContext) {
    return await models.Branches.createBranch(doc, user);
  },

  async branchesEdit(_root, { _id, ...doc }, { user, models }: IContext) {
    return await models.Branches.updateBranch(_id, doc, user);
  },

  async branchesRemove(_root, { ids }, { models }: IContext) {
    if (!ids.length) {
      throw new Error('You must specify at least one branch id to remove');
    }

    return await models.Branches.removeBranches(ids);
  },
};
