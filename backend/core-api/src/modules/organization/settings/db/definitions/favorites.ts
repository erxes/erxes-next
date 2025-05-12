import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Document, Schema } from 'mongoose';

export interface IFavorites {
  type: string;
  item: string;
  userId: string;
}

export interface IFavoritesDocument extends IFavorites, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const favoritesSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    type: {
      type: String,
      enum: ['plugin', 'view'],
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
