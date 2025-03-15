import { IContext } from 'backend/core-api/src/connectionResolvers';

export default {
  async unitsAdd(_root, doc, { user, models }: IContext) {
    return await models.Units.createUnit(doc, user);
  },

  async unitsEdit(_root, { _id, ...doc }, { user, models }: IContext) {
    return await models.Units.updateUnit(_id, doc, user);
  },

  async unitsRemove(_root, { ids }, { models }: IContext) {
    if (!ids.length) {
      throw new Error('You must specify at least one department id to remove');
    }

    return await models.Units.removeUnits(ids);
  },
};
