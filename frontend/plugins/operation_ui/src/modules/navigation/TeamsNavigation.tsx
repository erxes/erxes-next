import { useGetTeams } from '@/team/hooks/useGetTeams';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';
import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconBuilding } from '@tabler/icons-react';

export const TeamsNavigation = () => {
  const currentUser = useAtomValue(currentUserState);
  const { teams, loading } = useGetTeams({
    variables: { userId: currentUser?._id },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {teams?.map((team) => (
        <NavigationMenuLinkItem
          key={team._id}
          name={team.name}
          pathPrefix="operation"
          path={`team/${team._id}`}
          icon={IconBuilding}
        />
      ))}
    </div>
  );
};
