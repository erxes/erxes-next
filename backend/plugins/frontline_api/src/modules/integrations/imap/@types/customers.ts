
export interface IMapCustomer {
  inboxIntegrationId: string;
  contactsId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  integrationId?: string;
}

export interface IMapCustomerDocument extends IMapCustomer, Document {}
