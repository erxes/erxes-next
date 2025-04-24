import { Cell } from '@tanstack/react-table';
import { useSetAtom } from 'jotai';
import { RecordTable, useQueryState } from 'erxes-ui';
import { IPermission } from '@/settings/permission/types';
import { renderingCustomerDetailAtom } from '@/contacts/states/contactDetailStates';
export const PermissionMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IPermission, unknown>;
}) => {
  const [, setOpen] = useQueryState('permission_id');
  const setRenderingContactDetail = useSetAtom(renderingCustomerDetailAtom);
  const { _id } = cell.row.original;
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingContactDetail(false);
      }}
    />
  );
};

export const permissionMoreColumn = {
  id: 'more',
  cell: PermissionMoreColumnCell,
  size: 33,
};
