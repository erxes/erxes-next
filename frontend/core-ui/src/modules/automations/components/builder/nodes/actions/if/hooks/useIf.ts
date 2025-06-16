import { getContentType } from '@/automations/utils/automationBuilderUtils';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { IAction } from 'ui-modules';

export const useIf = (currentAction: IAction) => {
  const { watch } = useFormContext<TAutomationProps>();
  const { actions = [], triggers = [] } = watch('detail');

  const contentType = getContentType(currentAction, actions, triggers);

  return {
    contentType,
  };
};
