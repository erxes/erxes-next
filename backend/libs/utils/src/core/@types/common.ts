import * as express from 'express';
import { IUserDocument } from 'erxes-api-utils';
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

export interface IContext {
  res: express.Response;
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
    HelpersAPI: any;
  };
  dataLoaders: any;
  subdomain: string;
}

export interface IListParams {
  searchValue?: string;
  page?: number;
  perPage?: number;
}
