import { Control } from 'react-hook-form';

import { Form, Editor } from 'erxes-ui';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';
import { ContactHotKeyScope } from '@/contacts/types/ContactHotKeyScope';

export const DescriptionField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="description"
      render={({ field }) => (
        <Form.Item className="mb-5">
          <Form.Label>DESCRIPTION</Form.Label>

          <Form.Control>
            <Editor
              initialContent=""
              onChange={field.onChange}
              scope={ContactHotKeyScope.CustomerAddSheetDescriptionField}
            />
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};
