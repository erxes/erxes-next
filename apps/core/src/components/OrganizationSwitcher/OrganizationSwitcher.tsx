import { Sidebar, DropdownMenu } from 'erxes-ui';
import { ChevronsUpDown, Plus, Command } from 'lucide-react';

import { AudioWaveform } from 'lucide-react';
import { useState } from 'react';

export function OrganizationSwitcher() {
  const { isMobile } = Sidebar.useSidebar();
  const [activeTeam, setActiveTeam] = useState(organizations[0]);
  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Sidebar.MenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </Sidebar.MenuButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenu.Label className="text-xs text-muted-foreground">
              Teams
            </DropdownMenu.Label>
            {organizations.map((team, index) => (
              <DropdownMenu.Item
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
              </DropdownMenu.Item>
            ))}
            <DropdownMenu.Separator />
            <DropdownMenu.Item className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add organization
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  );
}

const organizations = [
  {
    name: 'Erxes',
    logo: () => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 81 113"
        fill="currentcolor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M45.1512 57.386C58.0443 39.1897 70.1817 19.9244 80.9291 0C68.6968 13.2829 54.277 32.6105 41.0725 51.5573C34.0734 41.8368 25.6995 31.417 16.1066 21.6561C25.6122 38.571 30.4201 47.8815 36.9976 57.4519C16.9953 86.5184 0.710876 113 0.710876 113C14.4243 97.773 28.0921 81.0082 41.0725 63.1085C46.6361 70.5005 53.8327 78.8701 65.332 91.4281C65.3092 91.4098 58.1317 76.3731 45.1512 57.386Z" />
      </svg>
    ),
    plan: 'Enterprise',
  },
  {
    name: 'Erxes Academy',
    logo: AudioWaveform,
    plan: 'Startup',
  },
  {
    name: 'Erxes Studio',
    logo: Command,
    plan: 'Free',
  },
];
