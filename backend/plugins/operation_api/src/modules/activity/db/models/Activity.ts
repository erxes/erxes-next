import { Model } from 'mongoose';

import { IModels } from '~/connectionResolvers';

import { activitySchema } from '@/activity/db/definitions/activity';

import { IActivity, IActivityDocument } from '@/activity/types';

export interface IActivityModel extends Model<IActivityDocument> {
  createActivity(doc: IActivity): Promise<IActivityDocument>;
}

export const loadActivityClass = (models: IModels) => {
  class Activity {
    public static async createActivity(
      doc: IActivity,
    ): Promise<IActivityDocument> {
      return models.Activity.create(doc);
    }
  }

  activitySchema.loadClass(Activity);

  return activitySchema;
};
