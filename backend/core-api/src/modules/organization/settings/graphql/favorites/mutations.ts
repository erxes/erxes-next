import { IContext } from '~/connectionResolvers';

export const favoriteMutations = {
  toggleFavorite: async (
    _root: undefined,
    { type, item, userId },
    { models }: IContext,
  ) => {
    const favorite = await models.Favorites.getFavorites({
      type,
      item,
      userId,
    });
    if (favorite) {
      await models.Favorites.deleteFavorite({ type, item, userId });
    } else {
      await models.Favorites.createFavorite({ type, item, userId });
    }
    return favorite;
  },
};

export default favoriteMutations;
