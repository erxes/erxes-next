import { IContext } from '../../../../../../@types/common';
export const positionMutations = {
  async positionsAdd(_root, doc, { user, models }: IContext) {
    const branch = await models.Positions.createPosition(doc, user);
    return branch;
  },

  async positionsEdit(_root, { _id, ...doc }, { user, models }: IContext) {
    const branch = await models.Positions.updatePosition(_id, doc, user);

    return branch;
  },

  async positionsRemove(_root, { ids }, { models }: IContext) {
    if (!ids.length) {
      throw new Error('You must specify at least one position id to remove');
    }

    const branch = await models.Positions.removePositions(ids);

    return branch;
  },
};
