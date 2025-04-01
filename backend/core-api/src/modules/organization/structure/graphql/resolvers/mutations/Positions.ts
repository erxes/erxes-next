import { IContext } from '../../../../../../connectionResolvers';
export const positionMutations = {
  async positionsAdd(_root, doc, { user, models }: IContext) {
    const position = await models.Positions.createPosition(doc, user);
    return position;
  },

  async positionsEdit(_root, { _id, ...doc }, { user, models }: IContext) {
    const position = await models.Positions.updatePosition(_id, doc, user);

    return position;
  },

  async positionsRemove(_root, { ids }, { models }: IContext) {
    if (!ids.length) {
      throw new Error('You must specify at least one position id to remove');
    }

    const position = await models.Positions.removePositions(ids);

    return position;
  },
};
