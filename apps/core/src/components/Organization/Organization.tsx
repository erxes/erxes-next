import { Sidebar, DropdownMenu } from 'erxes-ui';
import {
  AudioWaveform,
  ChevronDown,
  Command,
  LogOut,
  Plus,
  Settings,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { ThemeSelector } from '../ThemeSelector';
import { Link } from 'react-router-dom';

export function Organization() {
  const [activeTeam, setActiveTeam] = useState(organizations[0]);
  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Sidebar.MenuButton className="w-fit px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <activeTeam.logo className="size-3" />
              </div>
              <span className="truncate font-semibold">{activeTeam.name}</span>
              <ChevronDown className="opacity-50" />
            </Sidebar.MenuButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg">
            <DropdownMenu.RadioGroup
              value={activeTeam.name}
              onValueChange={(value) => {
                const org = organizations.find((org) => org.name === value);
                if (org) {
                  setActiveTeam(org);
                }
              }}
            >
              {organizations.map((org) => (
                <DropdownMenu.RadioItem value={org.name} key={org.name}>
                  <org.logo className="size-4 mr-2" />
                  <span>{org.name}</span>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
            <DropdownMenu.Item>
              <Plus />
              <span>Add new workspace</span>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item asChild>
              <Link to="/settings/account">
                <User />
                <span>Account settings</span>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link to="/settings/workspace">
                <Settings />
                <span>Workspace settings</span>
              </Link>
            </DropdownMenu.Item>
            <ThemeSelector />
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              <LogOut />
              <span>Logout</span>
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
    logo: ({ ...props }) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 81 113"
        fill="currentcolor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
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
