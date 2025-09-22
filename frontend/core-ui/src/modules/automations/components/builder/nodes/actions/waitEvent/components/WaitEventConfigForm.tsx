import { useWaitEventConfigForm } from '@/automations/components/builder/nodes/actions/waitEvent/hooks/useWaitEventConfigForm';
import { TAutomationBuilderForm } from '@/automations/utils/automationFormDefinitions';
import { Form, Select } from 'erxes-ui';
import { useFormContext } from 'react-hook-form';
import { TAutomationActionProps } from 'ui-modules';
import { WaitEventConfigContent } from './WaitEventConfigContent';

export const WaitEventConfigForm = ({
  currentAction,
  currentActionIndex,
}: TAutomationActionProps) => {
  const { control } = useFormContext<TAutomationBuilderForm>();

  const { waitEventOptions, configFieldName, config } = useWaitEventConfigForm(
    currentAction,
    currentActionIndex,
  );

  const { targetType } = config || {};

  console.log({ config });

  return (
    <div className="p-6 h-full flex flex-col">
      <Form.Field
        name={`${configFieldName}.targetType`}
        control={control}
        defaultValue={waitEventOptions[0]?.type}
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Select target</Form.Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <Select.Trigger id="target-type" className="mt-1">
                <Select.Value placeholder="Select target type" />
              </Select.Trigger>
              <Select.Content>
                {waitEventOptions.map(({ type, label }) => (
                  <Select.Item key={type} value={type}>
                    {label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Form.Item>
        )}
      />
      <WaitEventConfigContent
        targetType={targetType}
        action={currentAction}
        configFieldName={configFieldName}
      />
    </div>
  );
};
