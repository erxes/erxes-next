import { IContext } from '~/connectionResolvers';

export const favoriteQueries = {
  getFavoritesByUserId: async (
    _root: undefined,
    { userId }: { userId: string },
    { models }: IContext,
  ) => {
    return models.Favorites.getFavoritesByUserId({ userId });
  },
};

export default favoriteQueries;
