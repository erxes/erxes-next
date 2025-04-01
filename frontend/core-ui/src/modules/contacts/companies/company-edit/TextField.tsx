import { ITextFieldContainerProps, TextField } from 'erxes-ui';
import { useCompaniesEdit } from '@/contacts/companies/hooks/useCompaniesEdit';

export const CompanyTextField = ({
  placeholder,
  value,
  field,
  fieldId,
  _id,
}: ITextFieldContainerProps) => {
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
    <TextField
      placeholder={placeholder}
      value={value}
      field={field}
      fieldId={fieldId}
      _id={_id}
      onSave={onSave}
    />
  );
};
