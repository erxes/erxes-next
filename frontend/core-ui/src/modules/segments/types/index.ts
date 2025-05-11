import {
  FieldValues,
  UseFieldArrayRemove,
  UseFormReturn,
} from 'react-hook-form';

export interface ListQueryResponse {
  segments: ISegment[];
}

export interface IAttributeFilter {
  name: string;
  operator: string;
  value: string;
}

export interface IOperator {
  name: string;
  value: string;
  noInput?: boolean;
}

export interface ICondition {
  // type: 'property' | 'event' | 'subSegment';

  propertyType?: string;
  propertyName?: string;
  propertyOperator?: string;
  propertyValue?: string;

  eventName?: string;
  eventOccurence?: 'exactly' | 'atleast' | 'atmost';
  eventOccurenceValue?: number;
  eventAttributeFilters?: IAttributeFilter[];

  subSegmentId?: string;
  subSegmentForPreview?: ISegment;

  config?: any;
}

export interface IConditionDocument extends ICondition, Document {}

export interface ISegment {
  _id?: string;
  contentType: string;
  name: string;
  description?: string;
  subOf?: string;
  color?: string;
  shouldWriteActivityLog: boolean;
  count?: number;

  conditions: ICondition[];
  conditionsConjunction?: 'and' | 'or';
  conditionSegments: ISegment[];

  scopeBrandIds?: string[];

  config?: any;
}

export type IField = {
  name: string;
  selectOptions?: Array<{ label: string; value: string | number }>;
  type?: string;
  group?: string;
  value: string;
  label: string;
  options?: string[];
  validation?: string;
  choiceOptions?: string[];
  selectionConfig?: {
    queryName: string;
    selectionName: string;
    valueField: string;
    labelField: string;
    multi?: boolean;
  };
};

export type FieldQueryResponse = {
  fieldsCombinedByContentType: IField[];
  segmentsGetAssociationTypes: { value: string; description: string }[];
};

export type IFormFieldName =
  | `conditions.${number}`
  | `conditionSegments.${number}.conditions.${number}`;

export type IProperty<TForm extends FieldValues> = {
  index: number;
  form: UseFormReturn<TForm>;
  condition: ICondition;
  remove: () => void;
  isFirst: boolean;
  isLast: boolean;
  total: number;
  parentFieldName?: `conditionSegments.${number}`;
};

export type IPropertyField<TForm extends FieldValues> = {
  index: number;
  form: UseFormReturn<TForm>;
  fields: IField[];
  currentField?: IField;
  parentFieldName: IFormFieldName;
  defaultValue?: any;
  propertyTypes: any[];
};

export type IPropertyCondtion<TForm extends FieldValues> = {
  index: number;
  form: UseFormReturn<TForm>;
  currentField?: IField;
  operators: IOperator[];
  parentFieldName: IFormFieldName;
  defaultValue?: any;
};

export type IPropertyInput<TForm extends FieldValues> = {
  index: number;
  form: UseFormReturn<TForm>;
  parentFieldName: IFormFieldName;
  defaultValue?: any;
  operators: IOperator[];
  selectedField?: IField;
};

export interface ISegmentMap {
  _id?: string;
  key: string;
  contentType: string;
  config?: any;
  conditions: ICondition[];
  conditionsConjunction: string;
}

export interface IConditionsForPreview {
  type: string;
  subSegmentForPreview: ISegmentMap;
}
