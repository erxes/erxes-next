import { getContentType } from '@/automations/utils/automationBuilderUtils';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext } from 'react-hook-form';

export const useSendEmailSidebarForm = (currentActionIndex: number) => {
  const { control, watch } = useFormContext<TAutomationProps>();
  const config = watch(`detail.actions.${currentActionIndex}.config`);
  const { actions = [], triggers = [] } = watch('detail');
  const contentType = getContentType(
    actions[currentActionIndex],
    actions,
    triggers,
  );

  return { control, config, contentType };
};

export const useSendEmailCustomMailField = (currentActionIndex: number) => {
  const { control, watch, setValue } = useFormContext<TAutomationProps>();
  const config = watch(`detail.actions.${currentActionIndex}.config`);

  const removeMail = (mail: string) => {
    setValue(
      `detail.actions.${currentActionIndex}.config.customMails`,
      (config?.customMails || []).filter((value: string) => value !== mail),
    );
  };

  const onChange = (e: any, onChange: (...props: any[]) => void) => {
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
