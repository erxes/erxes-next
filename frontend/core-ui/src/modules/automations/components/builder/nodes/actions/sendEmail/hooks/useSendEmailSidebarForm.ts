import { TAutomationActionConfigField } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';
import { findTriggerForAction } from '@/automations/utils/automationBuilderUtils/triggerUtils';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { KeyboardEvent, KeyboardEventHandler } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const useSendEmailSidebarForm = (currentActionIndex: number) => {
  const configFieldName: TAutomationActionConfigField = `actions.${currentActionIndex}.config`;

  const { control } = useFormContext<TAutomationBuilderForm>();
  const [triggers = [], actions = [], config = {}] =
    useWatch<TAutomationBuilderForm>({
      control,
      name: ['triggers', 'actions', `${configFieldName}`],
    });

  const contentType = findTriggerForAction(
    actions[currentActionIndex].id,
    actions,
    triggers,
  )?.type;

  return { control, config, contentType };
};

export const useSendEmailCustomMailField = (currentActionIndex: number) => {
  const configFieldName: TAutomationActionConfigField = `actions.${currentActionIndex}.config`;
  const { control, setValue } = useFormContext<TAutomationBuilderForm>();
  const config = useWatch({ control, name: configFieldName });

  const removeMail = (mail: string) => {
    setValue(
      `${configFieldName}.customMails`,
      (config?.customMails || []).filter((value: string) => value !== mail),
    );
  };

  const onChange = (
    e: KeyboardEvent<HTMLInputElement>,
    onChange: (...props: any[]) => void,
  ) => {
    const { value } = e.currentTarget;
    if (
      e.key === 'Enter' &&
      value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      onChange((config?.customMails || []).concat(value));
      e.currentTarget.value = '';
    }
  };

  return { onChange, removeMail, control, config };
};
