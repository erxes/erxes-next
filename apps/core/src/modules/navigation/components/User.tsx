import { Sidebar, DropdownMenu, Avatar, useIsMobile } from 'erxes-ui';
import { IconSelector, IconBell, IconLogout } from '@tabler/icons-react';
import { ThemeSelector } from './ThemeSelector';
import { SelectLanguages } from './SelectLanguages';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from 'erxes-shared-states';

import { useRecoilValue } from 'recoil';
import { readFile } from 'erxes-ui/utils/core';

export function User() {
  const isMobile = useIsMobile();

  const { handleLogout } = useAuth();

  const currentUser = useRecoilValue(currentUserState);

  const userDetail = currentUser?.details;

  if (!userDetail) return null;

  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Sidebar.MenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar.Root className="h-8 w-8 rounded">
                <Avatar.Image
                  src={readFile(userDetail.avatar)}
                  alt={userDetail.fullName}
                />
                <Avatar.Fallback className="rounded-lg">
                  {userDetail.fullName.split('')[0]}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="grid flex-1 text-left text-[13px] leading-tight">
                <span className="truncate font-semibold">
                  {userDetail.fullName}
                </span>
                <span className="truncate text-xs opacity-80">
                  {currentUser.email}
                </span>
              </div>
              <IconSelector className="ml-auto size-4" />
            </Sidebar.MenuButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenu.Label className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar.Root className="h-8 w-8 rounded-lg">
                  <Avatar.Image
                    src={readFile(userDetail.avatar)}
                    alt={userDetail.fullName}
                  />
                  <Avatar.Fallback className="rounded-lg"></Avatar.Fallback>
                </Avatar.Root>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {userDetail.fullName}
                  </span>
                  <span className="truncate text-xs">{currentUser.email}</span>
                </div>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <ThemeSelector />
            <SelectLanguages />
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                <IconBell />
                Notifications
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={() => handleLogout()}>
              <IconLogout />
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  );
}
