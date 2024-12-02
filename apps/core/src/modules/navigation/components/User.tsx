import { Sidebar, DropdownMenu, Avatar } from 'erxes-ui';
import { ChevronsUpDown, Bell, LogOut } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { SelectLanguages } from './SelectLanguages';
import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import { useRecoilValue } from 'recoil';

export function User() {
  const { isMobile } = Sidebar.useSidebar();

  const { handleLogout } = useAuth();

  const currentUser = useRecoilValue(currentUserState);

  const userDetail = currentUser?.details || {};

  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Sidebar.MenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar.Root className="h-8 w-8 rounded-lg">
                <Avatar.Image
                  src={userDetail.avatar}
                  alt={userDetail.fullName}
                />
                <Avatar.Fallback className="rounded-lg">
                  {userDetail.fullName.split('')[0]}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {userDetail.fullName}
                </span>
                <span className="truncate text-xs">{currentUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
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
                    src={userDetail.avatar}
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
                <Bell />
                Notifications
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={() => handleLogout()}>
              <LogOut />
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  );
}
