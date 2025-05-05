import { Cell, ColumnDef } from '@tanstack/react-table';
import { RecordTable } from 'erxes-ui';
import { renderingCustomerDetailAtom } from '@/contacts/states/customerDetailStates';
import { useSetAtom } from 'jotai';
import { ICustomer } from '@/contacts/types/customerType';
import { useQueryState } from 'erxes-ui';
import { usePreviousHotkeyScope } from 'erxes-ui';
import { CustomerHotKeyScope } from '@/contacts/types/CustomerHotKeyScope';

export const CustomerMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ICustomer, unknown>;
}) => {
  const [, setOpen] = useQueryState('contactId');
  const setRenderingCustomerDetail = useSetAtom(renderingCustomerDetailAtom);
  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();
  const { _id } = cell.row.original;
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setTimeout(() => {
          setHotkeyScopeAndMemorizePreviousScope(
            CustomerHotKeyScope.CustomerEditSheet,
          );
        }, 100);
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
