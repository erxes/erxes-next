export interface ICustomerInline {
  _id: string;
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  avatar?: string;
}

export interface ICustomer extends ICustomerInline {
  type: CustomerType;
}

export enum CustomerType {
  CUSTOMER = 'customer',
  COMPANY = 'company',
  USER = 'user',
}
