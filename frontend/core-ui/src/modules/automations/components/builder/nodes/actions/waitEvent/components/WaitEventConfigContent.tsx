import { TAutomationAction } from 'ui-modules';
import { TAutomationActionConfigField } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';
import { WaitEventConfigCustomForm } from '@/automations/components/builder/nodes/actions/waitEvent/components/WaitEventConfigCustomForm';
import { WaitEventConfigSegmentForm } from '@/automations/components/builder/nodes/actions/waitEvent/components/WaitEventConfigSegmentForm';
import {
  TAutomationWaitEventConfig,
  WaitEventTargetTypes,
} from '@/automations/components/builder/nodes/actions/waitEvent/type/waitEvent';

export function WaitEventConfigContent({
  targetType,
  action,
  selectedNodeId,
  configFieldName,
  handleSave,
}: {
  targetType: TAutomationWaitEventConfig['targetType'];
  action: TAutomationAction;
  selectedNodeId?: string;
  configFieldName: TAutomationActionConfigField;
  handleSave: (config: TAutomationWaitEventConfig) => void;
}) {
  if (targetType === 'custom') {
    return (
      <WaitEventConfigCustomForm
        configFieldName={configFieldName}
        handleSave={handleSave}
      />
    );
  }

  return (
    <WaitEventConfigSegmentForm
      targetType={targetType}
      action={action}
      selectedNodeId={selectedNodeId}
      configFieldName={configFieldName}
    />
  );
}
