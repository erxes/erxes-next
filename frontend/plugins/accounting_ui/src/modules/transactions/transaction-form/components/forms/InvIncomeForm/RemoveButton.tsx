import { IconX } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { ITransactionGroupForm, TInvDetail } from '../../../types/JournalForms';
import { useWatch } from 'react-hook-form';

export const RemoveButton = ({
  form,
  journalIndex,
  remove
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
  remove: (index: number | number[]) => void;
}) => {
  const details = useWatch({
    control: form.control,
    name: `trDocs.${journalIndex}.details`,
  });

  if (!details.filter(d => d.checked).length) return null;

  const handleRemove = () => {
    const indexes = details.map((d, ind) => d.checked && ind || -1).filter(d => d > -1)
    remove(indexes)
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
