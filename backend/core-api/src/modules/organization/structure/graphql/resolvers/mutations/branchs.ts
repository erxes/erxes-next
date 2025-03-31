import { IContext } from '../../../../../../@types/common';
export const branchsMutations = {
  async branchesAdd(_root, doc, { user, models }: IContext) {
    const branch = await models.Branches.createBranch(doc, user);

    return branch;
  },

  async branchesEdit(_root, { _id, ...doc }, { user, models }: IContext) {
    const branch = await models.Branches.updateBranch(_id, doc, user);

    return branch;
  },

  async branchesRemove(_root, { ids }, { models }: IContext) {
    if (!ids.length) {
      throw new Error('You must specify at least one branch id to remove');
    }
    const deleteResponse = await models.Branches.removeBranches(ids);
    return deleteResponse;
  },
};
