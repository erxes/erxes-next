import { TextField } from 'erxes-ui';
import { useCustomersEdit } from '@/contacts/customer-edit/hooks/useCustomerEdit';

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
  fieldId,
  _id,
  className,
}: TextFieldProps) => {
  const { customersEdit } = useCustomersEdit();
  const onSave = (editingValue: string) => {
    if (editingValue === value) return;
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
      field={field}
      fieldId={fieldId}
      _id={_id}
      onSave={onSave}
      className={className}
    />
  );
};
