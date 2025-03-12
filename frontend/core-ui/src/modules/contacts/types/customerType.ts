import { CountryCode } from 'libphonenumber-js';
export interface ICustomer {
  _id: string;
  integration?: any;
  trackedData?: any[];
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phones?: string[];
  sex?: number;
  primaryPhone?: string;
  primaryEmail?: string;
  emails?: string[];
  avatar?: string;
  state?: string;
  ownerId?: string;
  position?: string;
  location?: {
    userAgent?: string;
    country?: string;
    countryCode?: CountryCode;
    remoteAddress?: string;
    hostname?: string;
    language?: string;
  };
  department?: string;
  leadStatus?: string;
  hasAuthority?: string;
  description?: string;
  isSubscribed?: string;
  links?: ICustomerLinks;
  customFieldsData?: { [key: string]: any };
  code?: string;
  birthDate?: string;
  emailValidationStatus?: string;
  phoneValidationStatus?: string;
  isOnline?: boolean;
  lastSeenAt?: number;
  sessionCount?: number;
  score?: number;
}

export interface ICustomerLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedIn?: string;
  youtube?: string;
  github?: string;
}

export type TFieldTypes = 'string' | 'array' | 'object' | 'avatar';

export interface SelectUserFetchMoreProps {
  fetchMore: () => void;
  usersLength: number;
  totalCount: number;
}
