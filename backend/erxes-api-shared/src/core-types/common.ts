import { IUserDocument } from './modules/team-member/user';
import { SortOrder } from 'mongoose';

export interface IRule {
  kind: string;
  text: string;
  condition: string;
  value: string;
}

export interface ILink {
  [key: string]: string;
}

export interface IRuleDocument extends IRule, Document {
  _id: string;
}
export interface ICursorPaginateParams {
  limit?: number;
  cursor?: string | null;
  direction?: 'forward' | 'backward';
  sortField?: string;
  orderBy? : Record<string, SortOrder>;
}

export interface ICursorPaginateResult<T> {
  list: T[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | undefined;
    endCursor: string | undefined;
  };
  totalCount: number;
}

export interface IListParams {
  searchValue?: string;
  sortField?: string;
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
  req: any;
  requestInfo: any;
  user: IUserDocument;
  models?: any;
  __: <T extends object>(doc: T) => T & { processId: string };
  processId: string;
}
export interface ILogDoc {
  subdomain: string;
  source: 'webhook' | 'graphql' | 'mongo' | 'auth';
  action: string;
  payload: any;
  userId?: string;
  executionTime?: {
    startDate: Date;
    endDate: Date;
    durationMs: number;
  };
  status?: 'failed' | 'success';
  processId?: string;
}

export interface IOrderInput {
  _id: string;
  order: number;
}

export interface IAttachment {
  name: string;
  url: string;
  size: number;
  type: string;
}
