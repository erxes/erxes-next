import { cn, TextField } from 'erxes-ui';
import clsx from 'clsx';
import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';
import { useCustomerEdit } from 'ui-modules';

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
  const { customerEdit } = useCustomerEdit();
  const onSave = (newValue: string) => {
    customerEdit({
      variables: { _id, [field]: newValue },
    });
  };

  return (
    <TextField
      {...props}
      value={props.value}
      scope={clsx(ContactsHotKeyScope.CustomersPage, field, _id)}
      onSave={onSave}
      className={cn('shadow-sm rounded-sm text-sm', props.className)}
    />
  );
};
