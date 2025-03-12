import { Control } from 'react-hook-form';

import { Input, Form } from 'erxes-ui/components';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';
export const PrimaryPhoneField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="primaryPhone"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>PHONE</Form.Label>
          <Form.Control>
            <Input className="rounded-md h-8" {...field} />
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};
