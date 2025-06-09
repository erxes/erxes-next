import { IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui/components/button';
import { useWatch } from 'react-hook-form';
import { TR_SIDES } from '~/modules/transactions/types/constants';
import { ITransactionGroupForm, TInvDetail } from '../../../types/JournalForms';
import { getTempId } from '../../utils';
// import { useInventoryContext } from '../hooks/useInventoryContext';

export const AddInventoryRowButton = ({
  append,
  journalIndex,
  form
}: {
  form: ITransactionGroupForm;
  journalIndex: number;
  append: (product: TInvDetail | TInvDetail[]) => void;
}) => {
  const { control } = form;

  const preDetails = useWatch({
    control,
    name: `trDocs.${journalIndex}.details`,
  });

  const lastDetail = preDetails[preDetails.length - 1]

  const detailDefaultValues = {
    ...lastDetail,
    _id: getTempId(),
    side: TR_SIDES.DEBIT,
    amount: 0,
    productId: '',
    count: 0,
    unitPrice: 0,
  };

  return (
    <>
      <Button
        variant="secondary"
        className="bg-border"
        onClick={() => append(detailDefaultValues)}
      >
        <IconPlus />
        Add Empty Row
      </Button>
      <Button
        variant="secondary"
        className="bg-border"
        onClick={() =>
          append([
            detailDefaultValues,
            detailDefaultValues,
            detailDefaultValues,
          ])
        }
      >
        <IconPlus />
        Add Many Products
      </Button>
    </>
  );
};
