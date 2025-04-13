import { ICustomer, ICustomerDocument } from 'erxes-api-shared/core-types';
import { Model } from 'mongoose';
import { IModels } from '../../../../connectionResolvers';
import { customerSchema } from '../definitions/customers';

export interface ICustomerModel extends Model<ICustomerDocument> {
  getCustomer(_id: string): Promise<ICustomerDocument>;
  getCustomerName(customer: ICustomer): string;
  createCustomer(doc: ICustomer): Promise<ICustomerDocument>;
  updateCustomer(_id: string, doc: ICustomer): Promise<ICustomerDocument>;
  removeCustomers(customerIds: string[]): Promise<{ n: number; ok: number }>;
}

export const loadCustomerClass = (models: IModels) => {
  class Customer {
    public static getCustomerName(customer: ICustomer) {
      if (customer.firstName || customer.lastName) {
        return (customer.firstName || '') + ' ' + (customer.lastName || '');
      }

      if (customer.primaryEmail || customer.primaryPhone) {
        return customer.primaryEmail || customer.primaryPhone;
      }

      return 'Unknown';
    }

    /**
     * Retrieves customer
     */
    public static async getCustomer(_id: string) {
      const customer = await models.Customers.findOne({ _id }).lean();

      if (!customer) {
        throw new Error('Customer not found');
      }

      return customer;
    }

    /**
     * Create a customer
     */
    public static async createCustomer(
      doc: ICustomer,
    ): Promise<ICustomerDocument> {
      if (doc.primaryEmail && !doc.emails) {
        doc.emails = [doc.primaryEmail];
      }

      if (doc.primaryPhone && !doc.phones) {
        doc.phones = [doc.primaryPhone];
      }

      const customer = await models.Customers.create(doc);

      return models.Customers.getCustomer(customer._id);
    }

    /*
     * Update customer
     */
    public static async updateCustomer(_id: string, doc: ICustomer) {
      return await models.Customers.findOneAndUpdate(
        { _id },
        { $set: { ...doc, modifiedAt: new Date() } },
        { new: true },
      );
    }

    /**
     * Remove customers
     */
    public static async removeCustomers(customerIds: string[]) {
      return models.Customers.deleteMany({ _id: { $in: customerIds } });
    }
  }

  customerSchema.loadClass(Customer);

  return customerSchema;
};
