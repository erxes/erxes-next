import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { findTriggerForAction } from '@/automations/utils/automationBuilderUtils/triggerUtils';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { TAutomationAction } from 'ui-modules';

export function useWaitEventConfigContent(
  targetType: 'trigger' | 'action' | 'custom',
  action: TAutomationAction,
  selectedNodeId?: string,
) {
  const { getValues } = useFormContext<TAutomationBuilderForm>();
  const { actions } = useAutomationNodes();

  if (targetType === 'trigger') {
    const trigger = findTriggerForAction(
      action.id,
      getValues('actions'),
      getValues('triggers'),
    );
    return { contentType: trigger?.type } as const;
  }

  return {
    contentType: actions.find((a) => a.id === selectedNodeId)?.type,
  } as const;
}
