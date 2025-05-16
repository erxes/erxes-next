import { SegmentFormProps } from './schema';

export const getDefaultValues = (
  propertyType: string,
  segment: any,
  isTempoaray?: boolean,
) => {
  const {
    subSegmentConditions = [],
    conditions = [],
    name,
    description,
    config,
    conditionsConjunction,
    subOf,
    getSubSegments,
  } = segment;

  const values: SegmentFormProps = {
    name: name || '',
    description: description || '',
    config: config || {},
    conditionsConjunction: conditionsConjunction || 'or',
    subOf: subOf || '',
  };

  if (subSegmentConditions.length) {
    values.conditionSegments = subSegmentConditions;
  } else if (conditions.length) {
    values.conditions = conditions;
  } else {
    values.conditions = [
      { propertyType, propertyName: '', propertyOperator: '' },
    ];
  }

  return values;
};
