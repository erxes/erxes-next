import { TextField } from 'erxes-ui';
import { useUserEdit } from '@/settings/team-member/hooks/useUserEdit';
import { IUsersDetails } from '@/settings/team-member/types';

interface TextFieldProps {
  placeholder?: string;
  value: string;
  field: keyof IUsersDetails;
  fieldId?: string;
  _id: string;
  className?: string;
}

export const TextFieldUserDetails = ({
  placeholder,
  value,
  field,
  fieldId,
  _id,
  className,
}: TextFieldProps) => {
  const { usersEdit } = useUserEdit();
  const onSave = (editingValue: string) => {
    if (editingValue === value) return;
    usersEdit(
      {
        variables: { _id, details: { [field]: editingValue } },
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
