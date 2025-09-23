import { findTriggerForAction } from '@/automations/utils/automationBuilderUtils/triggerUtils';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { useFormContext, useWatch } from 'react-hook-form';
import { getFieldsProperties, TAutomationAction } from 'ui-modules';
import { TAutomationManagePropertyConfig } from '../types/ManagePropertyTypes';
import { TAutomationActionConfigField } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';

export const useManagePropertySidebarContent = (
  currentActionIndex: number,
  currentAction: TAutomationAction,
) => {
  const fieldName: TAutomationActionConfigField = `actions.${currentActionIndex}.config`;
  const { setValue, control } = useFormContext<TAutomationBuilderForm>();
  const [actions = [], triggers = [], config = {}] =
    useWatch<TAutomationBuilderForm>({
      control,
      name: ['triggers', 'actions', `${fieldName}`],
    });
  const { module, rules = [{ field: '', operator: '' }] } = (config ||
    {}) as TAutomationManagePropertyConfig;

  const propertyType =
    module ||
    findTriggerForAction(currentAction.id, actions, triggers)?.type ||
    '';

  const { propertyTypes } = getFieldsProperties(propertyType);

  const addRule = () => {
    setValue(fieldName, {
      ...config,
      rules: [...(rules || []), { field: '', operator: '' }],
    });
  };

  return {
    addRule,
    propertyTypes,
    setValue,
    control,
    propertyType,
    fieldName,
    rules,
    module,
  };
};
