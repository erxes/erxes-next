import { Control } from 'react-hook-form';

import { Form, Switch } from 'erxes-ui';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';

export const IsSubscribedField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <Form.Field
      name="isSubscribed"
      control={control}
      render={({ field }) => (
        <Form.Item className="flex flex-col">
          <Form.Label>SUBSCRIBED</Form.Label>
          <Form.Control>
            <div className="p-2">
              <Switch
                className="scale-150 w-7"
                checked={field.value === 'Yes'}
                onCheckedChange={(checked) =>
                  field.onChange(checked ? 'Yes' : 'No')
                }
              />
            </div>
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};
