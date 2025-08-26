import { useAutomationTrigger } from '@/automations/components/builder/hooks/useAutomationTrigger';
import { useAutomation } from '@/automations/context/AutomationProvider';
import { useAutomationNodes } from '@/automations/hooks/useAutomationNodes';
import { Form, Select, Card } from 'erxes-ui';
import { IActionProps, SegmentForm } from 'ui-modules';
import { useFormContext, useWatch } from 'react-hook-form';
import { TAutomationBuilderForm } from '@/automations/utils/AutomationFormDefinitions';

type ActionConfigFieldType = `actions.${number}.config`;

export const WaitEventConfigForm = ({
  currentAction,
  currentActionIndex,
  handleSave,
}: IActionProps) => {
  const { trigger } = useAutomationTrigger(currentAction.id);
  const { actions } = useAutomationNodes();
  const { actionsConst } = useAutomation();
  const { control, watch, setValue } = useFormContext<TAutomationBuilderForm>();

  const configField: ActionConfigFieldType = `actions.${currentActionIndex}.config`;
  const { targetType, targetId } = watch(configField) || {
    targetType: trigger?.type,
  };

  const actionTypesCanBeTarget = actionsConst
    .filter(({ canBeTarget }) => canBeTarget)
    .map(({ type }) => type);

  const actionsCanBeTarget = actions.filter(({ type }) =>
    actionTypesCanBeTarget.includes(type),
  );

  const hasTargetableActions = actionsCanBeTarget.length > 0;

  const handleTargetTypeChange = (value: string) => {
    setValue(configField, { targetType: value });
  };

  const handleTargetIdChange = (value: string) => {
    handleSave({ targetId: value });
  };

  if (!hasTargetableActions && !trigger) {
    return (
      <div className="w-[650px] flex flex-col max-h-full">
        <div className="p-4">
          <p className="text-sm text-gray-600">
            No targetable actions available. This action will wait for the
            trigger event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col max-h-full">
      {hasTargetableActions && (
        <Card.Content className="flex flex-row gap-4 w-96 pt-6">
          <Form.Field
            name={`${configField}.targetType`}
            control={control}
            render={({ field }) => (
              <Form.Item className="flex-1">
                <Form.Label>Select target</Form.Label>
                <Select
                  value={field.value}
                  onValueChange={handleTargetTypeChange}
                >
                  <Select.Trigger id="target-type" className="mt-1">
                    <Select.Value placeholder="Select target type" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="trigger">Trigger</Select.Item>
                    {actionsCanBeTarget.map((action) => (
                      <Select.Item key={action.id} value={action.id}>
                        {action.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Item>
            )}
          />
        </Card.Content>
      )}

      {/* {targetType && ( */}
      <SegmentForm
        contentType={
          targetType === 'trigger' ? trigger?.type || '' : targetType
        }
        segmentId={targetId}
        callback={handleTargetIdChange}
        isTemporary
      />
      {/* )} */}
    </div>
  );
};
