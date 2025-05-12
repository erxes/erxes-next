import { IUserDocument } from './modules/team-member/user';

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
  cursor?: string;
  direction: 'forward' | 'backward';
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
  docModifier: <T>(doc: T) => any;
  brandIdSelector: object;
  userBrandIdsSelector: object;
  commonQuerySelector: object;
  commonQuerySelectorElk: object;
  singleBrandIdSelector: object;
  dataSources: {
    AutomationsAPI: any;
    EngagesAPI: any;
    IntegrationsAPI: any;
    HelpersApi: any;
  };
  dataLoaders: any;
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

export interface IAttachment {
  name: string;
  url: string;
  size: number;
  type: string;
}
