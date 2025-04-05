import { Control } from 'react-hook-form';

import { Form, Input } from 'erxes-ui';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';

export const LastNameField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="lastName"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>LAST NAME</Form.Label>
          <Form.Control>
            <Input
              className="rounded-md h-8"
              {...field}
              value={field?.value || ''}
            />
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};
