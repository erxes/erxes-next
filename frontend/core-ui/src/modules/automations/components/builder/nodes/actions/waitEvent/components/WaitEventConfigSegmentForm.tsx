import { TAutomationAction } from 'ui-modules';
import { TAutomationActionConfigField } from '@/automations/components/builder/nodes/types/coreAutomationActionTypes';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { Form } from 'erxes-ui';
import { SegmentForm } from 'ui-modules';
import { useWaitEventConfigContent } from '@/automations/components/builder/nodes/actions/waitEvent/hooks/useWaitEventConfigContent';

export function WaitEventConfigSegmentForm({
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
  const { control } = useFormContext<TAutomationBuilderForm>();

  const { contentType } = useWaitEventConfigContent(
    targetType,
    action,
    selectedNodeId,
  );

  if (!contentType) {
    return (
      <Form.Item className="flex-1">
        <Form.Label>Conditions</Form.Label>
        <div className="text-muted-foreground text-sm">
          Select a target to configure conditions
        </div>
      </Form.Item>
    );
  }

  return (
    <Form.Field
      name={`${configFieldName}.segmentId`}
      control={control}
      render={({ field }) => (
        <Form.Item className="flex-1">
          <Form.Label>Conditions</Form.Label>
          <SegmentForm
            contentType={contentType}
            segmentId={field.value}
            callback={field.onChange}
            isTemporary
          />
        </Form.Item>
      )}
    />
  );
}
