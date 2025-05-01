import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';
import { Schema } from 'mongoose';

export const lastvieweditemSchema = new Schema({
  _id: mongooseStringRandomId,
  productId: { type: String, label: 'ProductId', index: true },
  customerId: { type: String, label: 'CustomerId', index: true },
  modifiedAt: { type: Date, label: 'Date' },
});

lastvieweditemSchema.index({ customerId: 1, productId: 1 });

export const productReviewSchema = new Schema({
  _id: mongooseStringRandomId,
  productId: { type: String, label: 'Product' },
  customerId: { type: String, label: 'Customer' },
  review: { type: Number, label: 'Review' },
  description: { type: String, label: 'Description' },
  info: { type: Object, label: 'Info' },
  createdAt: { type: Date, label: 'Created Date' },
  modifiedAt: { type: Date, label: 'Modified Date' },
});

export const wishlistSchema = new Schema({
  _id: mongooseStringRandomId,
  productId: { type: String, label: 'ProductId' },
  customerId: { type: String, label: 'CustomerId' },
});
