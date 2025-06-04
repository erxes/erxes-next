import { IContext } from '~/connectionResolvers';

const tourMutations = {
  bmTourAdd: async (_root, doc, { user, models }: IContext) => {
    const element = await models.Tours.createTour(doc, user);
    return element;
  },

  bmTourEdit: async (_root, { _id, ...doc }, { models }: IContext) => {
    const updated = await models.Tours.updateTour(_id, doc as any);
    return updated;
  },
  bmTourViewCount: async (_root, { _id }, { models }: IContext) => {
    return await models.Tours.findOneAndUpdate(
      { _id: _id },
      { $inc: { viewCount: 1 } },
    ).exec();
  },

  bmTourRemove: async (
    _root,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) => {
    await models.Tours.removeTour(ids);

    return ids;
  },
};

export default tourMutations;
