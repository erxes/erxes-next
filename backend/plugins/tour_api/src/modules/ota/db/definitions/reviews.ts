import { Document, Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';

export interface IReview {
  customerId: string;
  rating: number;
  comment: string;
  type: 'hotel' | 'tour';
  objectId: string;
  bookingId: string;
}

export interface IReviewDocument extends IReview, Document {
  _id: string;
  createdAt: Date;
}

export const reviewSchema = new Schema<IReviewDocument>(
  {
    _id: mongooseStringRandomId,
    customerId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false },
    type: { type: String, required: true },
    objectId: { type: String, required: true },
    bookingId: { type: String, required: true },
  },
  { timestamps: true }
);

reviewSchema.index({ hotelId: 1 });
