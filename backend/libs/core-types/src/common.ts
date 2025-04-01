import { IUserDocument } from './modules/team-member/user';

export interface IListParams {
  searchValue?: string;
  page?: number;
  perPage?: number;
}

export interface IStringMap {
  [key: string]: string;
}

export interface ICustomField {
  field: string;
  value: any;
  stringValue?: string;
  numberValue?: number;
  dateValue?: Date;
}

export interface IBrowserInfo {
  language?: string;
  url?: string;
  city?: string;
  countryCode?: string;
}

export interface IAttachment {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface IPdfAttachment {
  pdf?: IAttachment;
  pages: IAttachment[];
}

export interface IMainContext {
  res: any;
  requestInfo: any;
  subdomain: string;
  user: IUserDocument;
}
