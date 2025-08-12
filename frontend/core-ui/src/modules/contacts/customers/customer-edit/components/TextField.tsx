import { cn, TextField } from 'erxes-ui';
import { useCustomersEdit } from '@/contacts/customers/customer-edit/hooks/useCustomerEdit';

interface TextFieldProps {
  field: string;
  fieldId?: string;
  _id: string;
  scope: string;
}

export const TextFieldCustomer = ({
  field,
  _id,
  scope,
  ...props
}: Omit<React.ComponentProps<typeof TextField>, 'scope' | 'onValueChange'> &
  TextFieldProps) => {
  const { customersEdit } = useCustomersEdit();
  const onSave = (newValue: string) => {
    customersEdit(
      {
        variables: { _id, [field]: newValue },
      },
      [field],
    );
  };

  return (
    <TextField
      {...props}
      value={props.value}
      scope={scope}
      onSave={onSave}
      className={cn('shadow-sm rounded-sm text-sm', props.className)}
    />
  );
};
