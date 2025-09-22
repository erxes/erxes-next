import { TAutomationAction } from 'ui-modules';
import { TAutomationActionConfigField } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';
import { WaitEventConfigCustomForm } from '@/automations/components/builder/nodes/actions/waitEvent/components/WaitEventConfigCustomForm';
import { WaitEventConfigSegmentForm } from '@/automations/components/builder/nodes/actions/waitEvent/components/WaitEventConfigSegmentForm';

export function WaitEventConfigContent({
  targetType,
  action,
  selectedNodeId,
  configFieldName,
}: {
  targetType: 'trigger' | 'action' | 'custom';
  action: TAutomationAction;
  selectedNodeId?: string;
  configFieldName: TAutomationActionConfigField;
}) {
  if (targetType === 'custom') {
    return <WaitEventConfigCustomForm configFieldName={configFieldName} />;
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
