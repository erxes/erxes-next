import { CountryCode } from 'libphonenumber-js';
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
  links?: object;
  code?: string;
  emailValidationStatus?: string;
  phoneValidationStatus?: string;
  emails?: string[];
  phones?: string[];
  tagIds?: string[];
  location?: {
    countryCode?: CountryCode | undefined;
  };
}

export enum CustomerType {
  CUSTOMER = 'customer',
  COMPANY = 'company',
  USER = 'user',
}
