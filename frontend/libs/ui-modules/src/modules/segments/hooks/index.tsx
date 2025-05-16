import { useQuery } from '@apollo/client';
import { FieldQueryResponse, IField, IOperator } from '../types';
import queries from '../graphql/queries';
import { DEFAULT_OPERATORS, OPERATORS } from '../constants';
import { useQueryState } from 'erxes-ui';

export const getFieldsProperties = (propertyType?: string) => {
  const [contentType] = useQueryState<string>('contentType');
  const { data, loading } = useQuery<FieldQueryResponse>(
    queries.propertiesWithFields,
    {
      variables: { contentType: propertyType || contentType },
      skip: !contentType && !propertyType,
    },
  );

  const { fieldsCombinedByContentType = [], segmentsGetAssociationTypes = [] } =
    data || {};

  return {
    fields: fieldsCombinedByContentType,
    propertyTypes: segmentsGetAssociationTypes,
    loading,
  };
};

export const getSelectedFieldConfig = (
  fieldName: string,
  fields: IField[],
): { selectedField: IField; operators: IOperator[] } | undefined => {
  if (!fieldName) {
    return;
  }

  const selectedField = fields.find((field) => field.name === fieldName);

  if (!selectedField) {
    return undefined;
  }

  const { type, validation } = selectedField || {};

  const operatorType = (type || validation || '').toLowerCase() as
    | 'string'
    | 'boolean'
    | 'number'
    | 'date';

  const operators = OPERATORS[operatorType] || DEFAULT_OPERATORS;

  return { selectedField, operators };
};
