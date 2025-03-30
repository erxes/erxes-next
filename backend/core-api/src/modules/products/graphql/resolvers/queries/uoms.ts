import { IContext } from 'core-api/@types';

export const uomQueries = {
  /**
   * Uoms list
   */
  async uoms(_root, _args, { models }: IContext) {
    return models.Uoms.find({}).sort({ order: 1 }).lean();
  },

  /**
   * Get all uoms count. We will use it in pager
   */
  async uomsTotalCount(_root, _args, { models }: IContext) {
    return models.Uoms.find({}).countDocuments();
  },
};
