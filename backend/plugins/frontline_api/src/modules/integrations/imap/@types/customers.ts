import { Document } from 'mongoose';
export interface IIMapCustomer {
  inboxIntegrationId: string;
  contactsId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  integrationId?: string;
}

export interface IIMapCustomerDocument extends IIMapCustomer, Document {}
