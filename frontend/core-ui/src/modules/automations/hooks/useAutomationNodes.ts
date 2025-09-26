import { AutomationNodesType, AutomationNodeType } from '@/automations/types';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { useFieldArray, useFormContext } from 'react-hook-form';
import isEqual from 'lodash/isEqual';

export const useAutomationNodes = () => {
  const { control, watch, setValue } = useFormContext<TAutomationBuilderForm>();

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
    newTriggers?: TAutomationBuilderForm[AutomationNodesType.Triggers];
    newActions?: TAutomationBuilderForm[AutomationNodesType.Actions];
    newWorkflows?: TAutomationBuilderForm[AutomationNodesType.Workflows];
  }) => {
    if (newTriggers) {
      if (!isEqual(newTriggers, triggers)) {
        setValue(AutomationNodesType.Triggers, newTriggers);
      }
    }
    if (newActions) {
      if (!isEqual(newActions, actions)) {
        setValue(AutomationNodesType.Actions, newActions);
      }
    }
    if (newWorkflows) {
      if (!isEqual(newWorkflows, workflows)) {
        setValue(AutomationNodesType.Workflows, newWorkflows);
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
