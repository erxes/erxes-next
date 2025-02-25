import { Text } from 'erxes-ui/modules/record-field/components/Text';
import { useCompaniesEdit } from '@/contacts/companies/hooks/useCompaniesEdit';

interface TextFieldProps {
  placeholder?: string;
  value: string;
  field: string;
  fieldId?: string;
  _id: string;
}

export const TextField = ({
  placeholder,
  value,
  field,
  fieldId,
  _id,
}: TextFieldProps) => {
  const { companiesEdit } = useCompaniesEdit();
  const onSave = (editingValue: string) => {
    if (editingValue === value) return;
    companiesEdit(
      {
        variables: { _id, [field]: editingValue },
      },
      [field],
    );
  };
  return (
    <Text
      placeholder={placeholder}
      value={value}
      field={field}
      fieldId={fieldId}
      _id={_id}
      onSave={onSave}
    />
  );
};
