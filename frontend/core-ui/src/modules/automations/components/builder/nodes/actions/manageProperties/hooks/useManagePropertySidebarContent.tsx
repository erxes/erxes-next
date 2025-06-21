import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import {
  IConfig,
  IManagePropertyFieldName,
} from '../types/ManagePropertyTypes';
import { useFormContext, useWatch } from 'react-hook-form';
import { getContentType } from '@/automations/utils/automationBuilderUtils';
import { getFieldsProperties, groupFieldsByType, IAction } from 'ui-modules';
import { useMemo } from 'react';

export const useManagePropertySidebarContent = (
  currentActionIndex: number,
  currentAction: IAction,
) => {
  const fieldName: IManagePropertyFieldName = `detail.actions.${currentActionIndex}.config`;
  const { setValue, control } = useFormContext<TAutomationProps>();
  const [actions = [], triggers = [], config = {}] = useWatch<TAutomationProps>(
    {
      control,
      name: ['detail.triggers', 'detail.actions', `${fieldName}`],
    },
  );
  const { module, rules = [{ field: '', operator: '' }] } = (config ||
    {}) as IConfig;
  const propertyType =
    module || getContentType(currentAction.id, actions, triggers)?.type || '';

  const {
    propertyTypes,
    fields = [],
    loading,
  } = getFieldsProperties(propertyType);
  const groups = groupFieldsByType(fields || []);

  const addRule = () => {
    setValue(fieldName, {
      ...config,
      rules: [...(rules || []), { field: '', operator: '' }],
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
