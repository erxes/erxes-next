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
  emails?: string[];
  emailValidationStatus?: string;
}

export enum CustomerType {
  CUSTOMER = 'customer',
  COMPANY = 'company',
  USER = 'user',
}
