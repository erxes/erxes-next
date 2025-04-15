import { Request, Response } from 'express';
import { IUserDocument } from './modules/team-member/user';

export interface ICursorPaginateParams {
  limit?: number;
  cursor?: string;
  direction: 'forward' | 'backward';
  sortField?: string;
}

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
  req: Request;
  res: Response;
  requestInfo: any;
  subdomain: string;
  user: IUserDocument;
}

export interface ILogDoc {
  source: 'webhook' | 'graphql' | 'mongo';
  action: string;
  payload: any;
  userId?: string;
  executionTime?: {
    startDate: Date;
    endDate: Date;
    durationMs: number;
  };
  status?: 'failed' | 'success';
}
