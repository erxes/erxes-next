import { Control } from 'react-hook-form';

import { Form, Input } from 'erxes-ui';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';

export const CodeField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="code"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>CODE</Form.Label>
          <Form.Control>
            <Input className="rounded-md h-8" {...field} />
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};
