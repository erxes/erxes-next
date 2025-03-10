import { Document } from 'mongoose';
import { IListParams, IStringMap } from './common';

export interface IAddress {
  id: string; // lng_lat || random
  location: {
    type: string;
    coordinates: number[];
  };
  address: {
    countryCode: string;
    country: string;
    postCode: string;
    city: string;
    city_district: string;
    suburb: string;
    road: string;
    street: string;
    building: string;
    number: string;
    other: string;
  };
  short: string;
}

export interface ICustomer {
  state?: 'visitor' | 'lead' | 'customer';

  firstName?: string;
  lastName?: string;
  middleName?: string;
  birthDate?: Date;
  sex?: number;
  primaryEmail?: string;
  emails?: string[];
  avatar?: string;
  primaryPhone?: string;
  phones?: string[];
  primaryAddress?: IAddress;
  addresses?: IAddress[];

  description?: string;
  doNotDisturb?: string;
  isSubscribed?: string;
  emailValidationStatus?: string;
  phoneValidationStatus?: string;
  links?: IStringMap;
  status?: string;
  code?: string;
}

export interface ICustomerDocument extends ICustomer, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface ICustomerQueryFilterParams extends IListParams {
  createdAt?: Date
}
