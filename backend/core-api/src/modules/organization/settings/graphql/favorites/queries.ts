import { IContext } from '~/connectionResolvers';

export const favoriteQueries = {
  getFavoritesByCurrentUser: async (
    _parent: undefined,
    _args: undefined,
    { models, user }: IContext,
  ) => {
    return models.Favorites.getFavoritesByCurrentUser({ userId: user._id });
  },

  isFavorite: async (
    _parent: undefined,
    { type, item }: { type: string; item: string },
    { models, user }: IContext,
  ) => {
    const favorite = await models.Favorites.getFavorite({
      type,
      item,
      userId: user._id,
    });
    console.log(favorite);
    return favorite ? true : false;
  },
};

export default favoriteQueries;
