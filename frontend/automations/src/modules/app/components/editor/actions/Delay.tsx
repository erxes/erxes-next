import { Card, Form, Input, Select } from 'erxes-ui/components';
import { useFormContext } from 'react-hook-form';
import { IActionProps } from 'ui-modules';
import { TAutomationProps } from '../common/formSchema';

export const Delay = ({ currentActionIndex }: IActionProps) => {
  const { control } = useFormContext<TAutomationProps>();
  return (
    <Card.Content className="flex flex-row gap-4 w-96">
      <Form.Field
        name={`detail.actions.${currentActionIndex}.config.value`}
        control={control}
        render={({ field }) => (
          <Form.Item className="flex-1">
            <Form.Label>Wait for</Form.Label>
            <Input {...field} type="number" />
          </Form.Item>
        )}
      />

      <Form.Field
        name={`detail.actions.${currentActionIndex}.config.type`}
        control={control}
        render={({ field }) => (
          <Form.Item className="flex-1">
            <Form.Label>Time unit</Form.Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <Select.Trigger id="time-unit" className="mt-1">
                <Select.Value placeholder="Select unit" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="minute">Minutes</Select.Item>
                <Select.Item value="hour">Hours</Select.Item>
                <Select.Item value="day">Days</Select.Item>
                <Select.Item value="week">Weeks</Select.Item>
              </Select.Content>
            </Select>
          </Form.Item>
        )}
      />
    </Card.Content>
  );
};

export const NodeContent = ({ config }: any) => {
  const { value, type } = config || {};
  return (
    <div className="flex justify-between text-slate-600 text-xs">
      <span className="font-mono">Wait for:</span>
      <span className="font-mono">{`${value} ${type}s`}</span>
    </div>
  );
};
