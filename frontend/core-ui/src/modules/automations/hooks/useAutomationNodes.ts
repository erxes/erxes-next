import { AutomationNodeType } from '@/automations/types';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext } from 'react-hook-form';

export const useAutomationNodes = () => {
  const { watch } = useFormContext<TAutomationBuilderForm>();

  const [triggers = [], actions = [], workflows = []] = watch([
    'triggers',
    'actions',
    'workflows',
  ]);

  const getList = (
    type:
      | AutomationNodeType.Action
      | AutomationNodeType.Trigger
      | AutomationNodeType.Workflow,
  ) => {
    return (
      { trigger: triggers, action: actions, workflow: workflows }[type] || []
    );
  };

  return {
    triggers,
    actions,
    workflows,
    getList,
  };
};
