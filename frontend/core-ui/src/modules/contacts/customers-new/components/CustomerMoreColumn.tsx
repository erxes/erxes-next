import { Cell, ColumnDef } from '@tanstack/react-table';
import { RecordTable } from 'erxes-ui';
import { renderingCustomerDetailAtom } from '@/contacts/states/customerDetailStates';
import { useSetAtom } from 'jotai';
import { ICustomer } from '@/contacts/types/customerType';
import { useQueryState } from 'erxes-ui';

export const CustomerMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ICustomer, unknown>;
}) => {
  const [, setOpen] = useQueryState('contact_id');
  const setRenderingCustomerDetail = useSetAtom(renderingCustomerDetailAtom);
  const { _id } = cell.row.original;
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingCustomerDetail(false);
      }}
    />
  );
};

export const customerMoreColumn: ColumnDef<ICustomer> = {
  id: 'more',
  cell: CustomerMoreColumnCell,
  size: 33,
};
