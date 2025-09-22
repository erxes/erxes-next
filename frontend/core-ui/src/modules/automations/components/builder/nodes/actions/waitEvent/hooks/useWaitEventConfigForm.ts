import { WAIT_EVENT_TYPES } from '@/automations/components/builder/nodes/actions/waitEvent/constants/waitEventConstants';
import { TAutomationActionConfigField } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';
import { useAutomation } from '@/automations/context/AutomationProvider';
import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { findTriggerForAction } from '@/automations/utils/automationBuilderUtils/triggerUtils';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { TAutomationAction } from 'ui-modules';

export function useWaitEventConfigForm(
  currentAction: TAutomationAction,
  currentActionIndex: number,
) {
  const { actionsConst } = useAutomation();
  const { actions } = useAutomationNodes();

  const { getValues, watch } = useFormContext<TAutomationBuilderForm>();
  const configFieldName: TAutomationActionConfigField = `actions.${currentActionIndex}.config`;

  const config = watch(configFieldName);

  const trigger = findTriggerForAction(
    currentAction.id,
    getValues('actions'),
    getValues('triggers'),
  );

  let waitEventOptions = WAIT_EVENT_TYPES;

  if (trigger?.isCustom) {
    waitEventOptions = waitEventOptions.filter(
      ({ type }) => type !== 'trigger',
    );
  }

  const actionTypesCanBeTarget = actionsConst
    .filter(({ canBeTarget }) => canBeTarget)
    .map(({ type }) => type);

  const actionsCanBeTarget = actions.filter(({ type }) =>
    actionTypesCanBeTarget.includes(type),
  );

  if (!actionsCanBeTarget?.length) {
    waitEventOptions = waitEventOptions.filter(({ type }) => type !== 'action');
  }

  return {
    waitEventOptions,
    configFieldName,
    config,
  } as const;
}
