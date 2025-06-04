import { IContext } from '~/connectionResolvers';

const itineraryMutations = {
  bmItineraryAdd: async (_root, doc, { user, models }: IContext) => {
    const element = await models.Itineraries.createItinerary(doc, user);
    return element;
  },

  bmItineraryEdit: async (_root, { _id, ...doc }, { models }: IContext) => {
    const updated = await models.Itineraries.updateItinerary(_id, doc as any);
    return updated;
  },

  bmItineraryRemove: async (
    _root,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) => {
    await models.Itineraries.removeItinerary(ids);

    return ids;
  },
};

export default itineraryMutations;
