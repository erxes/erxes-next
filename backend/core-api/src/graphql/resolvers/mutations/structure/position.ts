import { IContext } from 'backend/core-api/src/connectionResolvers';

export default {
  async positionsAdd(_root, doc, { user, models }: IContext) {
    return await models.Positions.createPosition(doc, user);
  },

  async positionsEdit(_root, { _id, ...doc }, { user, models }: IContext) {
    return await models.Positions.updatePosition(_id, doc, user);
  },

  async positionsRemove(_root, { ids }, { models }: IContext) {
    if (!ids.length) {
      throw new Error('You must specify at least one position id to remove');
    }

    return await models.Positions.removePositions(ids);
  },
};
