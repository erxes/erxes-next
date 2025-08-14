import { useGetTeams } from '@/team/hooks/useGetTeams';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';
import {
  Button,
  Collapsible,
  IconComponent,
  NavigationMenuGroup,
  NavigationMenuLinkItem,
  Sidebar,
  Skeleton,
} from 'erxes-ui';
import {
  IconCaretRightFilled,
  IconChecklist,
  IconClipboard,
} from '@tabler/icons-react';

type Team = {
  _id: string;
  name: string;
  icon?: string;
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full h-4" />
      ))}
    </div>
  );
}

interface TeamItemProps {
  team: Team;
}

function TeamItem({ team }: TeamItemProps) {
  return (
    <Collapsible className="group/collapsible">
      <Sidebar.Group className="p-0">
        <Collapsible.Trigger asChild>
          <Button variant="ghost" className="px-2">
            <IconComponent
              name={team.icon}
              className="text-accent-foreground"
            />
            <span className="font-sans text-xs font-semibold normal-case">
              {team.name}
            </span>
            <span className="ml-auto">
              <IconCaretRightFilled className="size-3 transition-transform group-data-[state=open]/collapsible:rotate-90 text-accent-foreground" />
            </span>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content className="pt-1">
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              <NavigationMenuLinkItem
                name="Projects"
                pathPrefix="operation/team"
                className="pl-6 font-medium"
                icon={IconClipboard}
                path={`${team._id}/projects`}
              />
              <NavigationMenuLinkItem
                name="Tasks"
                pathPrefix="operation/team"
                path={`${team._id}/tasks`}
                className="pl-6 font-medium"
                icon={IconChecklist}
              />
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Collapsible.Content>
      </Sidebar.Group>
    </Collapsible>
  );
}

export function TeamsNavigation() {
  const currentUser = useAtomValue(currentUserState);
  const { teams, loading } = useGetTeams({
    variables: { userId: currentUser?._id },
  });

  return (
    <NavigationMenuGroup name="Your Teams">
      {loading ? (
        <LoadingSkeleton />
      ) : (
        teams?.map((team) => <TeamItem key={team._id} team={team} />)
      )}
    </NavigationMenuGroup>
  );
}
