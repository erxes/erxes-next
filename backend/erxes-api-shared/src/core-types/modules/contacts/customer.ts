import { Document } from 'mongoose';

import {
  ICursorPaginateParams,
  ICustomField,
  IListParams,
  IStringMap,
} from '../../common';
import { IAddress } from './contacts-common';

export interface IVisitorContact {
  email?: string;
  phone?: string;
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

  relatedIntegrationIds?: string[];
  deviceTokens?: string[];
  trackedData?: ICustomField[];
  customFieldsData?: ICustomField[];
  lastSeenAt?: Date;
  isOnline?: boolean;
  sessionCount?: number;
  visitorContactInfo?: IVisitorContact;
}

export interface ICustomerDocument extends ICustomer, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface ICustomerQueryFilterParams
  extends ICursorPaginateParams,
    IListParams {
  createdAt?: Date;
}
