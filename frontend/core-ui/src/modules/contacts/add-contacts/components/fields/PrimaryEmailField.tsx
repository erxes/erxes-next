import { Control } from 'react-hook-form';

import { Form, Input } from 'erxes-ui';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';

export const PrimaryEmailField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="primaryEmail"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>EMAIL</Form.Label>
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
