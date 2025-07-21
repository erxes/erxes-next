import { cn, TextField } from 'erxes-ui';
import { useCustomersEdit } from '@/contacts/customers/customer-edit/hooks/useCustomerEdit';

interface TextFieldProps {
  field: string;
  fieldId?: string;
  _id: string;
}

export const TextFieldCustomer = ({
  field,
  _id,
  ...props
}: Omit<React.ComponentProps<typeof TextField>, 'scope' | 'onValueChange'> &
  TextFieldProps) => {
  const { customersEdit } = useCustomersEdit();
  const onSave = (editingValue: string | number) => {
    customersEdit(
      {
        variables: { _id, [field]: editingValue },
      },
      [field],
    );
  };
  return (
    <TextField
      {...props}
      scope={`customer-${_id}-${field}`}
      onValueChange={onSave}
      className={cn('shadow-sm rounded-sm text-sm', props.className)}
    />
  );
};
