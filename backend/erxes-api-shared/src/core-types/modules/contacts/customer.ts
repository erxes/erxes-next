import { Document } from 'mongoose';
import { IListParams, IStringMap } from '../../common';
import { IAddress } from './contacts-common';

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
  createdAt?: Date;
}
