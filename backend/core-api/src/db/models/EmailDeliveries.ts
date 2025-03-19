import { IEmailDeliveries, IEmailDeliveriesDocument } from 'erxes-api-utils';
import { Model } from 'mongoose';
import { IModels } from '../../connectionResolvers';
import { emailDeliveriesSchema } from '../definitions/emailDeliveries';

export interface IEmailDeliveryModel extends Model<IEmailDeliveriesDocument> {
  createEmailDelivery(doc: IEmailDeliveries): Promise<IEmailDeliveriesDocument>;
  updateEmailDeliveryStatus(_id: string, status: string): Promise<void>;
}

export const loadEmailDeliveryClass = (models: IModels) => {
  class EmailDelivery {
    /**
     * Create an EmailDelivery document
     */
    public static async createEmailDelivery(doc: IEmailDeliveries) {
      return models.EmailDeliveries.create({
        ...doc,
      });
    }

    public static async updateEmailDeliveryStatus(_id: string, status: string) {
      return models.EmailDeliveries.updateOne({ _id }, { $set: { status } });
    }
  }

  emailDeliveriesSchema.loadClass(EmailDelivery);

  return emailDeliveriesSchema;
};
