import { Form, Label } from 'erxes-ui';
import { useFormContext } from 'react-hook-form';
import { JsonBuilderRoot } from './JsonBuilder';

export const OutgoingWebhookBody = () => {
  const { control } = useFormContext();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Body</Label>
      </div>
      <Form.Field
        control={control}
        name="body"
        render={() => (
          <Form.Item>
            <JsonBuilderRoot name="body" />
          </Form.Item>
        )}
      />
    </div>
  );
};
