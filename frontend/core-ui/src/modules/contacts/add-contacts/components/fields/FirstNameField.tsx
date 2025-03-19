import { Control } from 'react-hook-form';

import { Form, Input } from 'erxes-ui';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';

export const FirstNameField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="firstName"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>FIRST NAME</Form.Label>
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
