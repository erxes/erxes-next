import { IActivity } from '@/activity/types';
import { useGetTeams } from '@/team/hooks/useGetTeams';
import { Badge, IconComponent } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';

export const ActivityTeam = ({
  metadata,
}: {
  metadata: IActivity['metadata'];
}) => {
  const currentUser = useAtomValue(currentUserState);

  const { teams } = useGetTeams({
    variables: {
      userId: currentUser?._id,
    },
  });

  const { previousValue, newValue } = metadata;

  const previousTeam = teams?.find((team) => team._id === previousValue);
  const newTeam = teams?.find((team) => team._id === newValue);

  return (
    <div className="inline-flex items-center gap-1">
      changed team to
      <Badge variant="secondary" className="flex-none">
        <IconComponent name={newTeam?.icon} className="size-4" />
        {newTeam?.name}
      </Badge>
      from
      <Badge variant="secondary" className="flex-none">
        <IconComponent name={previousTeam?.icon} className="size-4" />
        {previousTeam?.name}
      </Badge>
    </div>
  );
};
