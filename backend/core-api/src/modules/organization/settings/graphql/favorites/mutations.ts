import { IContext } from '~/connectionResolvers';

export const favoriteMutations = {
  toggleFavorite: async (
    _parent: undefined,
    { type, item },
    { models, user }: IContext,
  ) => {
    let favorite = await models.Favorites.getFavorites({
      type,
      item,
      userId: user._id,
    });
    if (favorite) {
      return models.Favorites.deleteFavorite({ type, item, userId: user._id });
    } else {
      return models.Favorites.createFavorite({ type, item, userId: user._id });
    }
  },
};

export default favoriteMutations;
