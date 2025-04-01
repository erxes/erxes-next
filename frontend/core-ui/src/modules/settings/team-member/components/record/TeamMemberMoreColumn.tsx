import { Cell } from '@tanstack/react-table';
import { RecordTableMoreButton } from 'erxes-ui/modules/record-table/components/MoreColumn';
import { renderingContactDetailAtom } from '@/contacts/detail/states/contactDetailStates';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { IUser } from '@/settings/team-member/types';

export const TeamMemberMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IUser, unknown>;
}) => {
  const [, setOpen] = useQueryState('user_id');
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

export const teamMemberMoreColumn = {
  id: 'more',
  cell: TeamMemberMoreColumnCell,
  size: 33,
};
