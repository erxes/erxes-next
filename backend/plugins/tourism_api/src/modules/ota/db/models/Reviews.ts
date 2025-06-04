import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

import { IReview, IReviewDocument } from '@/ota/@types/reviews';
import { reviewSchema } from '@/ota/db/definitions/reviews';

export interface IReviewModel extends Model<IReviewDocument> {
  createReview: (data: IReview) => Promise<IReviewDocument>;
  updateReview: (
    id: string,
    data: Partial<IReview>,
  ) => Promise<IReviewDocument | null>;
  deleteReview: (id: string) => Promise<IReviewDocument | null>;
}

export const loadReviewClass = (models: IModels) => {
  class Reviews {
    public static createReview = async (data: IReview) => {
      return models.Reviews.create(data);
    };

    public static updateReview = async (
      _id: string,
      data: Partial<IReview>,
    ) => {
      return models.Reviews.findOneAndUpdate(
        { _id },
        { $set: data },
        { new: true },
      );
    };

    public static deleteReview = async (_id: string) => {
      return models.Reviews.findOneAndDelete({ _id });
    };
  }

  reviewSchema.loadClass(Reviews);
  return reviewSchema;
};
