import { Model } from 'mongoose';
import {IMapCustomerDocument} from '@/integrations/imap/@types/customers';
import { customerSchema } from '@/integrations/imap/db/definitions/customers'
export type IMapCustomerModel = Model<IMapCustomerDocument>;


export const loadImapCustomerClass = (models) => {
  class Customer {}

  customerSchema.loadClass(Customer);

  return customerSchema;
};