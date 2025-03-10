import { Form } from 'erxes-ui';
import { Control } from 'react-hook-form';
import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';
import { AssignMember } from 'ui-modules';

export const OwnerIdField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="ownerId"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>CHOOSE AN OWNER</Form.Label>
          <Form.Control>
            <div className="w-full">
              <AssignMember
                value={field.value}
                onValueChange={field.onChange}
                className="w-full shadow-xs"
              />
            </div>
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};
