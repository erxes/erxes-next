import { cn, TextField } from 'erxes-ui';
import { useCustomersEdit } from '@/contacts/customers/customer-edit/hooks/useCustomerEdit';
import { useDebounce } from 'use-debounce';
import { useState, useEffect } from 'react';

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
  const [value, setValue] = useState(props.value);
  const [debouncedValue] = useDebounce(value, 500);
  const { customersEdit } = useCustomersEdit();

  useEffect(() => {
    if (debouncedValue !== undefined && debouncedValue !== props.value) {
      customersEdit(
        {
          variables: { _id, [field]: debouncedValue },
        },
        [field],
      );
    }
  }, [debouncedValue, _id, field]);

  const onValueChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <TextField
      {...props}
      value={value}
      scope={`customer-${_id}-${field}`}
      onValueChange={onValueChange}
      className={cn('shadow-sm rounded-sm text-sm', props.className)}
    />
  );
};
