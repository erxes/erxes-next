import { currentOrganizationState } from 'ui-modules';

import {
  Avatar,
  cn,
  DropdownMenu,
  Sidebar,
  TextOverflowTooltip,
} from 'erxes-ui';

import { Logo } from '@/auth/components/Logo';
import { useAtom } from 'jotai';
import { IconChevronRight, IconSelector } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function Organization() {
  const [currentOrganization] = useAtom(currentOrganizationState);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Sidebar.MenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-auto p-2"
        >
          <div className="flex aspect-square size-7 rounded items-center justify-center overflow-hidden bg-primary flex-none">
            <Logo
              organizationLogo={currentOrganization?.logo}
              className="size-6 flex-none text-primary-foreground"
            />
          </div>
          <TextOverflowTooltip
            value={currentOrganization?.name || 'Name unavailable'}
            className={cn('font-medium text-sm', {
              'text-accent-foreground font-normal': !currentOrganization?.name,
            })}
          />
          <IconSelector className="ml-auto size-4 text-accent-foreground" />
        </Sidebar.MenuButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        <DropdownMenu.Item asChild>
          <Link to="/settings">Settings</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item>Invite and manage team members</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            Switch organization
            <IconChevronRight className="ml-auto size-4 text-accent-foreground" />
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent className="min-w-[300px]">
            <DropdownMenu.RadioGroup value="1">
              <DropdownMenu.RadioItem value="1">
                <Avatar
                  size="lg"
                  className="rounded outline-1 outline outline-black/10 -outline-offset-1"
                >
                  <Avatar.Image src="https://github.com/shadcn.png" />
                  <Avatar.Fallback className="rounded-none">CN</Avatar.Fallback>
                </Avatar>
                Organization 1
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="2">
                <Avatar
                  size="lg"
                  className="rounded outline-1 outline outline-black/10 -outline-offset-1"
                >
                  <Avatar.Image src="https://github.com/khbaterdene.png" />
                  <Avatar.Fallback className="rounded-none">CN</Avatar.Fallback>
                </Avatar>
                Organization 2
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="3">
                <Avatar
                  size="lg"
                  className="rounded outline-1 outline outline-black/10 -outline-offset-1"
                >
                  <Avatar.Image src="https://github.com/Enkhtuvshin0513.png" />
                  <Avatar.Fallback className="rounded-none">CN</Avatar.Fallback>
                </Avatar>
                Organization 3
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Item>Logout</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Label className="flex items-center gap-2">
          Version
          <span className="text-primary ml-auto tracking-wider">
            3.0.0-beta.1
          </span>
        </DropdownMenu.Label>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
