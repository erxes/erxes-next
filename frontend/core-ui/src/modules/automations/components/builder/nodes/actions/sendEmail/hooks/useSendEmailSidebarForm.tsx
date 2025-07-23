import { getContentType } from '@/automations/utils/automationBuilderUtils';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext, useWatch } from 'react-hook-form';

type TSendEmailConfigFieldName = `detail.actions.${number}.config`;

export const useSendEmailSidebarForm = (currentActionIndex: number) => {
  const configFieldName: TSendEmailConfigFieldName = `detail.actions.${currentActionIndex}.config`;

  const { control } = useFormContext<TAutomationProps>();
  const [triggers = [], actions = [], config = {}] = useWatch<TAutomationProps>(
    {
      control,
      name: ['detail.triggers', 'detail.actions', `${configFieldName}`],
    },
  );

  const contentType = getContentType(
    actions[currentActionIndex].id,
    actions,
    triggers,
  )?.type;

  return { control, config, contentType };
};

export const useSendEmailCustomMailField = (currentActionIndex: number) => {
  const configFieldName: TSendEmailConfigFieldName = `detail.actions.${currentActionIndex}.config`;
  const { control, setValue } = useFormContext<TAutomationProps>();
  const config = useWatch({ control, name: configFieldName });

  const removeMail = (mail: string) => {
    setValue(
      `${configFieldName}.customMails`,
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
