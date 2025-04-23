import { Cell } from '@tanstack/react-table';
import { RecordTableMoreButton } from 'erxes-ui/modules/record-table/components/MoreColumn';

import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { IUser } from '@/settings/team-member/types';
import { renderingTeamMemberDetailAtom } from '@/settings/team-member/states/renderingTeamMemberDetail';

export const TeamMemberMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IUser, unknown>;
}) => {
  const [, setOpen] = useQueryState('user_id');
  const setRenderingTeamMemberDetail = useSetAtom(
    renderingTeamMemberDetailAtom,
  );
  const { _id } = cell.row.original;
  return (
    <RecordTableMoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingTeamMemberDetail(false);
      }}
    />
  );
};

export const teamMemberMoreColumn = {
  id: 'more',
  cell: TeamMemberMoreColumnCell,
  size: 33,
};
