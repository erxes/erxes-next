import { PROPERTY_OPERATOR } from '@/automations/constants';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { getFieldsProperties, groupFieldsByType } from 'ui-modules';
import {
  TAutomationManagePropertyRule,
  OperatorType,
  TAutomationManagePropertyConfig,
} from '../types/ManagePropertyTypes';
import { TAutomationActionConfigFieldPrefix } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type ManagePropertyRuleProps = {
  rules: TAutomationManagePropertyRule[];
  index: number;
  fieldName: TAutomationActionConfigFieldPrefix;
  rule: TAutomationManagePropertyRule;
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
  const handleChange = (name: string, value: string) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [name]: value };
    setValue(`${fieldName}.rules`, updatedRules);
  };

  const selectedField = fields.find((field) => field.name === rule.field);

  const handleRemove = () => {
    setValue(
      `${fieldName}.rules`,
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
