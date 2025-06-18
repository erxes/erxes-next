import { IconPlus, IconUserFilled } from '@tabler/icons-react';
import { is } from 'date-fns/locale';
import {
  Button,
  cn,
  ScrollArea,
  Sidebar,
  TextOverflowTooltip,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import React from 'react';
import { IUserGroup, useUsersGroup } from 'ui-modules';

export const UsersGroupSidebar = () => {
  const { usersGroups, loading, error } = useUsersGroup();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  if (error) {
    return (
      <Sidebar collapsible="none" className="flex-none border-r">
        <UsersGroupSidebarHeader />
        <Sidebar.Group>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              <div className="text-destructive">
                Error loading users groups: {error?.message as string}
              </div>
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar>
    );
  }
  return (
    <Sidebar collapsible="none" className="flex-none border-r">
      <UsersGroupSidebarHeader />
      <Sidebar.Group className="pr-0">
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <ScrollArea>
              <div className="max-w-[--sidebar-width] max-h-[calc(100dvh-4.75rem)] pr-8">
                {usersGroups.map((group) => (
                  <UsersGroupSidebarItem
                    key={group._id}
                    group={group}
                    to={group._id ?? undefined}
                  />
                ))}
              </div>
              <ScrollArea.Bar />
            </ScrollArea>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar>
  );
};

export const UsersGroupSidebarHeader = () => {
  return (
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-semibold text-accent-foreground">
                Users Groups
              </span>
              <Button
                variant="ghost"
                className="text-xs font-semibold text-accent-foreground"
              >
                <IconPlus />
              </Button>
            </div>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
};

export const UsersGroupSidebarItem = ({
  to,
  group,
}: {
  to: string;
  group: IUserGroup;
}) => {
  const [groupId, setgroupId] = useQueryState<string>('groupId');
  const isActive = groupId === to;
  return (
    <Sidebar.MenuItem className="w-full">
      <Sidebar.MenuButton
        isActive={isActive}
        className="h-full gap-3 flex-col items-start p-3"
        onClick={() => {
          setgroupId(to);
        }}
      >
        <span className="flex flex-col gap-2 w-full">
          <TextOverflowTooltip
            className={cn(
              isActive ? 'text-primary' : 'text-foreground',
              'text-base font-semibold',
            )}
            value={group.name}
          />
          <TextOverflowTooltip
            className={cn(
              isActive ? 'text-muted-foreground' : 'text-accent-foreground',
              'text-base font-normal',
            )}
            value={group.description || 'No description provided'}
          />
        </span>
        <span
          className={cn(
            isActive ? 'text-muted-foreground' : 'text-accent-foreground',
            'flex items-center gap-1 w-full font-normal',
          )}
        >
          <IconUserFilled size={16} />
          {group.members?.length || 0} members
        </span>
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  );
};
