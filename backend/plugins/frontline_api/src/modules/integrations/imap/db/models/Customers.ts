import { Model } from 'mongoose';
import {IIMapCustomerDocument} from '@/integrations/imap/@types/customers';
import { customerSchema } from '@/integrations/imap/db/definitions/customers'
export type IIMapCustomerModel = Model<IIMapCustomerDocument>;


export const loadImapCustomerClass = (models) => {
  class Customer {}

  customerSchema.loadClass(Customer);

  return customerSchema;
};