import { SexCode } from 'erxes-ui';
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
  emailValidationStatus?: 'valid' | 'invalid';
  phoneValidationStatus?: 'valid' | 'invalid';
  emails?: string[];
  phones?: string[];
  tagIds?: string[];
  location?: {
    countryCode?: CountryCode | undefined;
  };
  sex?: SexCode;
}

export enum CustomerType {
  CUSTOMER = 'customer',
  COMPANY = 'company',
  USER = 'user',
}
