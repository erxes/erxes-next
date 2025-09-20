import { AutomationNodeType } from '@/automations/types';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import isEqual from 'lodash/isEqual';

export const useAutomationNodes = () => {
  const { watch, setValue } = useFormContext<TAutomationBuilderForm>();

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

  const setNodesChangeToState = ({
    newTriggers,
    newActions,
    newWorkflows,
  }: {
    newTriggers?: TAutomationBuilderForm['triggers'];
    newActions?: TAutomationBuilderForm['actions'];
    newWorkflows?: TAutomationBuilderForm['workflows'];
  }) => {
    if (newTriggers) {
      if (!isEqual(newTriggers, triggers)) {
        setValue('triggers', newTriggers);
      }
    }
    if (newActions) {
      if (!isEqual(newActions, actions)) {
        setValue('actions', newActions);
      }
    }
    if (newWorkflows) {
      if (!isEqual(newWorkflows, workflows)) {
        setValue('workflows', newWorkflows);
      }
    }
  };

  return {
    triggers,
    actions,
    workflows,
    getList,
    setNodesChangeToState,
  };
};
