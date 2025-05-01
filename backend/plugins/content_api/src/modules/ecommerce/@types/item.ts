import { Document } from 'mongoose';

export interface ILastViewedItem {
  productId: string;
  customerId: string;
}

export interface ILastViewedItemDocument extends ILastViewedItem, Document {
  _id: string;
  modifiedAt: Date;
}

export interface IProductReview {
  productId: string;
  customerId: string;
  review: number;
  description: string;
  info: any;
}

export interface IProductReviewDocument extends IProductReview, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IWishlist {
  productId: string;
  customerId: string;
}

export interface IWishlistDocument extends IWishlist, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
