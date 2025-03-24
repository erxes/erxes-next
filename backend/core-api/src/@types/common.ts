import { IUserDocument } from 'erxes-api-modules';
import { IModels } from '../connectionResolvers';

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
  res: any;
  requestInfo: any;
  models: IModels;
  subdomain: string;
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
}

export interface IListParams {
  searchValue?: string;
  page?: number;
  perPage?: number;
}
