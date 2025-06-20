import { Model } from 'mongoose';

import { IModels } from '~/connectionResolvers';
import { IOrder, IOrderDocument } from '@/bms/@types/order';
import { orderSchema } from '@/bms/db/definitions/order';

export interface IOrderModel extends Model<IOrderDocument> {
  createOrder(doc: IOrder, user: any): Promise<IOrderDocument>;
  getOrder(_id: string): Promise<IOrderDocument>;
  updateOrder(_id: string, doc: IOrder): Promise<IOrderDocument>;
  removeOrder(ids: string[]): Promise<IOrderDocument>;
}

export const loadOrderClass = (models: IModels) => {
  class Order {
    /**
     * Retrieves Order
     */
    public static async getOrder(_id: string) {
      const element = await models.Orders.findOne({ _id });
      if (!element) {
        throw new Error('Order not found');
      }
      return element;
    }
    /**
     * Create a Order
     */
    public static async createOrder(doc, user) {
      const element = await models.Orders.create({
        ...doc,
        createdAt: new Date(),
        modifiedAt: new Date(),
      });
      return element;
    }

    /**
     * Update Order
     */
    public static async updateOrder(_id, doc) {
      await models.Orders.updateOne(
        { _id },
        { $set: { ...doc, modifiedAt: new Date() } },
      );

      return models.Orders.findOne({ _id });
    }

    /**
     * Remove Order
     */
    public static async removeOrder(ids) {
      return models.Orders.deleteMany({ _id: { $in: ids } });
    }
  }
  orderSchema.loadClass(Order);
  return orderSchema;
};
