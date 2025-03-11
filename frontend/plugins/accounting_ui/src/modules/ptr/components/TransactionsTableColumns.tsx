import { Cell } from '@tanstack/react-table';
import { ITransaction } from '../types/Transaction';

export const transactionColumns = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
];

export const transactionMoreColumn = [
  {
    id: 'more',
  },
];

export const ContactMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ITransaction, unknown>;
}) => {
  const [, setOpen] = useQueryState('contact_id');
  const setRenderingContactDetail = useSetAtom(renderingContactDetailAtom);
  const { _id } = cell.row.original;
  return (
    <RecordTableMoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingContactDetail(false);
      }}
    />
  );
};
