import { TextField } from 'erxes-ui';
import { useCustomersEdit } from '@/contacts/customers/customer-edit/hooks/useCustomerEdit';

interface TextFieldProps {
  placeholder?: string;
  value: string;
  field: string;
  fieldId?: string;
  _id: string;
  className?: string;
}

export const TextFieldCustomer = ({
  placeholder,
  value,
  field,
  _id,
  className,
}: TextFieldProps) => {
  const { customersEdit } = useCustomersEdit();
  const onSave = (editingValue: string) => {
    customersEdit(
      {
        variables: { _id, [field]: editingValue },
      },
      [field],
    );
  };
  return (
    <TextField
      placeholder={placeholder}
      value={value}
      scope={`customer-${_id}-${field}`}
      onValueChange={onSave}
      className={className}
    />
  );
};
