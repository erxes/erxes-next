import { SexCode } from 'erxes-ui';
import { CountryCode } from 'libphonenumber-js';
import { ICompany } from './Company';

export interface ICustomerInline {
  _id: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  avatar?: string;
}
export interface ICustomer extends ICustomerInline {
  type?: CustomerType;
  links?: object;
  code?: string;
  emailValidationStatus?: 'valid' | 'invalid';
  phoneValidationStatus?: 'valid' | 'invalid';
  emails?: string[];
  phones?: string[];
  tagIds?: string[];
  ownerId?: string;
  score?: number;
  location?: {
    countryCode?: CountryCode | undefined;
  };
  sex?: SexCode;
}

export interface ICustomerDetail extends ICustomer {
  companies?: ICompany[];
  position?: string;
  department?: string;
}

export enum CustomerType {
  CUSTOMER = 'customer',
  COMPANY = 'company',
  USER = 'user',
}
