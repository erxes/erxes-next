import { Cell } from '@tanstack/react-table';
import { RecordTableMoreButton } from 'erxes-ui/modules/record-table/components/MoreColumn';
import { renderingContactDetailAtom } from '@/contacts/detail/states/contactDetailStates';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { IPermission } from '../types';
export const PermissionMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IPermission, unknown>;
}) => {
  const [, setOpen] = useQueryState('permission_id');
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

export const permissionMoreColumn = {
  id: 'more',
  cell: PermissionMoreColumnCell,
  size: 33,
};
