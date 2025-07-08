import { CountryCode } from 'libphonenumber-js';

export interface TCompany {
  _id: string;
  avatar?: string;
  primaryName: string;
  names?: string[];
  primaryEmail?: string;
  emails?: string[];
  primaryPhone?: string;
  phones?: string[];
  tagIds?: string[];
  location?: {
    countryCode?: CountryCode | undefined;
  };
  emailValidationStatus?: 'valid' | 'invalid';
  phoneValidationStatus?: 'valid' | 'invalid';
}
