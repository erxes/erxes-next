import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext } from 'react-hook-form';

export const useTriggersActions = () => {
  const { watch } = useFormContext<TAutomationBuilderForm>();

  const [triggers = [], actions = []] = watch(['triggers', 'actions']);

  const getList = (type: 'trigger' | 'action') => {
    return { trigger: triggers, action: actions }[type] || [];
  };

  return {
    triggers,
    actions,
    getList,
  };
};
