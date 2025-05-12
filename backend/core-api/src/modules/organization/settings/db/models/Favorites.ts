import { Model } from 'mongoose';

import { IModels } from '~/connectionResolvers';
import {
  IFavorites,
  favoritesSchema,
  IFavoritesDocument,
} from '@/organization/settings/db/definitions/favorites';

export interface IFavoritesModel extends Model<IFavoritesDocument> {
  createFavorite({
    type,
    item,
    userId,
  }: IFavorites): Promise<IFavoritesDocument>;
  getFavorites({
    type,
    item,
    userId,
  }: IFavorites): Promise<IFavoritesDocument[]>;

  getFavorite({ type, item, userId }: IFavorites): Promise<IFavoritesDocument>;

  deleteFavorite({
    type,
    item,
    userId,
  }: IFavorites): Promise<IFavoritesDocument>;

  getFavoritesByCurrentUser({
    userId,
  }: {
    userId: string;
  }): Promise<IFavoritesDocument[]>;
}

export const loadFavoritesClass = (models: IModels) => {
  class Favorites {
    public static async createFavorite({ type, item, userId }: IFavorites) {
      const favorite = await models.Favorites.create({ type, item, userId });
      return favorite;
    }

    public static async getFavoritesByCurrentUser({
      userId,
    }: {
      userId: string;
    }) {
      const favorites = await models.Favorites.find({ userId });
      return favorites;
    }

    public static async deleteFavorite({ type, item, userId }: IFavorites) {
      const favorite = await models.Favorites.findOneAndDelete({
        type,
        item,
        userId,
      });
    }

    public static async getFavorites({ type, item, userId }: IFavorites) {
      const favorite = await models.Favorites.findOne({ type, item, userId });
      return favorite;
    }

    public static async getFavorite({ type, item, userId }: IFavorites) {
      const favorite = await models.Favorites.findOne({ type, item, userId });
      return favorite;
    }
  }

  favoritesSchema.loadClass(Favorites);

  return favoritesSchema;
};
