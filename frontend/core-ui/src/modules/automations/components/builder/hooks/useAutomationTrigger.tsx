import { getContentType } from '@/automations/utils/automationBuilderUtils';
import { useWatch } from 'react-hook-form';

export const useAutomationTrigger = (currentActionId: string) => {
  const [actions, triggers] = useWatch({
    name: ['detail.actions', 'detail.triggers'],
  });

  const trigger = getContentType(
    currentActionId,
    actions || [],
    triggers || [],
  );

  return {
    trigger,
  };
};
