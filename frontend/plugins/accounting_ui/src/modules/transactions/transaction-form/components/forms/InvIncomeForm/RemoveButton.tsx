import { IconX } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { ITransactionGroupForm, TInvDetail } from '../../../types/JournalForms';
import { useWatch } from 'react-hook-form';

export const RemoveButton = ({
  form,
  journalIndex
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
}) => {
  const details = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details`,
  });

  if (!details.filter(d => d.checked).length) return null;

  const handleRemove = () => {
    form.setValue(`trDocs.${journalIndex}.details`, details.filter(d => !d.checked))
  };

  return (
    <Button
      variant="secondary"
      className="bg-destructive/10 text-destructive"
      onClick={handleRemove}
    >
      <IconX />
      Remove Selected
    </Button>
  );
};
