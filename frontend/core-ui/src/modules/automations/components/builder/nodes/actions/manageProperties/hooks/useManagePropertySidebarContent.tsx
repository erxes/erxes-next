import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import {
  IConfig,
  IManagePropertyFieldName,
} from '../types/ManagePropertyTypes';
import { useFormContext } from 'react-hook-form';
import { getContentType } from '@/automations/utils/automationBuilderUtils';
import { getFieldsProperties, groupFieldsByType, IAction } from 'ui-modules';

export const useManagePropertySidebarContent = (
  currentActionIndex: number,
  currentAction: IAction,
) => {
  const fieldName: IManagePropertyFieldName = `detail.actions.${currentActionIndex}.config`;
  const { setValue, watch, control } = useFormContext<TAutomationProps>();
  const { actions = [], triggers = [] } = watch('detail');
  const module = watch(`${fieldName}.module`);
  const propertyType =
    module || getContentType(currentAction, actions, triggers);

  const { propertyTypes, fields, loading } = getFieldsProperties(propertyType);

  const groups = groupFieldsByType(fields || []);
  const config = watch(fieldName) as IConfig;
  const { rules = [{ field: '', operator: '' }] } = config || {};

  const addRule = () => {
    setValue(fieldName, {
      ...config,
      rules: [...rules, { field: '', operator: '' }],
    });
  };

  return {
    addRule,
    groups,
    propertyTypes,
    loading,
    setValue,
    control,
    propertyType,
    fieldName,
    rules,
    fields,
    module,
  };
};
