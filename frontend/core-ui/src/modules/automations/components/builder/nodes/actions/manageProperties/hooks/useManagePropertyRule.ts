import { PROPERTY_OPERATOR } from '@/automations/constants';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { getFieldsProperties, groupFieldsByType } from 'ui-modules';
import {
  IManagePropertyFieldName,
  IManagePropertyRule,
  OperatorType,
} from '../types/ManagePropertyTypes';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type ManagePropertyRuleProps = {
  rules: IManagePropertyRule[];
  index: number;
  fieldName: IManagePropertyFieldName;
  rule: IManagePropertyRule;
  propertyType: string;
};

export const useManagePropertyRule = ({
  rules,
  index,
  fieldName,
  rule,
  propertyType,
}: ManagePropertyRuleProps) => {
  const { setValue } = useFormContext<TAutomationBuilderForm>();
  const { fields = [] } = getFieldsProperties(propertyType);
  const groups = groupFieldsByType(fields || []);
  const handleChange = (name: string, value: any) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [name]: value };
    setValue(`${fieldName}.rules` as any, updatedRules);
  };

  const selectedField = fields.find((field) => field.name === rule.field);

  const handleRemove = () => {
    setValue(
      `${fieldName}.rules` as any,
      rules.filter((_, ruleIndex) => index !== ruleIndex),
    );
  };

  const operatorType = selectedField?.name?.includes('customFieldsData')
    ? capitalizeFirstLetter(selectedField?.validation || 'String')
    : selectedField?.type || '';

  const operators =
    PROPERTY_OPERATOR[operatorType as OperatorType] ||
    PROPERTY_OPERATOR.Default;

  return {
    handleRemove,
    operators,
    handleChange,
    selectedField,
    fields,
    groups,
  };
};
