import { Document, Schema } from 'mongoose';

export interface IFavorites {
  type: string;
  path: string;
  userId: string;
}

export interface IFavoritesDocument extends IFavorites, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const favoritesSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['module', 'submenu'],
      required: true,
    },
    path: {
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
