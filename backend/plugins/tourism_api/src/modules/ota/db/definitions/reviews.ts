import { Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { IReviewDocument } from '@/ota/@types/reviews';

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
  { timestamps: true },
);

reviewSchema.index({ hotelId: 1 });
