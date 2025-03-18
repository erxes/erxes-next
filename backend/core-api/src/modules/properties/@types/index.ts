import { Document } from 'mongoose';
import { ILocationOption } from '../../@types/common';

interface IVisibility {
  isVisible?: boolean;
  isVisibleInDetail?: boolean;
}

interface IObjectListConfig {
  key: string;
  label: string;
  type: string;
}

export interface ILogic {
  fieldId: string;
  tempFieldId?: string;
  logicOperator?: string;
  logicValue?: string | number | Date | string[];
}

export interface IField extends IVisibility {
  contentType?: string;
  contentTypeId?: string;
  type?: string;
  validation?: string;
  regexValidation?: string;
  text: string;
  content?: string;
  description?: string;
  options?: string[];
  locationOptions?: ILocationOption[];
  objectListConfigs?: IObjectListConfig[];
  optionsValues?: string;
  isRequired?: boolean;
  isDefinedByErxes?: boolean;
  isVisibleToCreate?: boolean;
  isPermanent?: boolean;
  isLocked?: boolean;
  order?: number;
  groupId?: string;
  canHide?: boolean;
  lastUpdatedUserId?: string;
  associatedFieldId?: string;
  code?: string;

  logics?: ILogic[];
  logicAction?: string;
  tempFieldId?: string;
  column?: number;

  pageNumber?: number;
  showInCard?: boolean;
  productCategoryId?: string;

  relationType?: string;

  subFieldIds?: string[];
}

export interface IFieldDocument extends IField, Document {
  _id: string;
}

export interface IFieldGroup extends IVisibility {
  name?: string;
  contentType?: string;
  parentId?: string;
  order?: number;
  isDefinedByErxes?: boolean;
  alwaysOpen?: boolean;
  description?: string;
  lastUpdatedUserId?: string;
  code?: string;
  config?: any;

  logics?: ILogic[];
  logicAction?: string;
}

export interface IFieldGroupDocument extends IFieldGroup, Document {
  _id: string;
}

export interface IFieldsQuery {
  contentType: string;
  contentTypeId?: string;
  isVisible?: boolean;
  isDefinedByErxes?: boolean;
  searchable?: boolean;
  isVisibleToCreate?: boolean;
  groupId?: any;
}
