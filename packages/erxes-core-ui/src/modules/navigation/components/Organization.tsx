import { IconBell, IconSelector } from '@tabler/icons-react';
import { currentOrganizationState } from 'erxes-ui-shared-states';
import { useRecoilValue } from 'recoil';

import { Button, Sidebar } from 'erxes-ui/components';

import { Logo } from '@/auth/components/Logo';

export function Organization() {
  const currentOrganization = useRecoilValue(currentOrganizationState);

  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.Content>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 flex-auto">
              <div className="flex aspect-square size-5 rounded items-center justify-center overflow-hidden">
                <Logo
                  organizationLogo={currentOrganization?.logo}
                  className="size-8 rounded-md bg-system text-system-foreground"
                />
              </div>
              <div className="text-[13px] flex flex-col">
                <span className="font-medium truncate">
                  {currentOrganization?.name || 'erxes'}
                </span>
              </div>
              <IconSelector className="ml-auto size-4 text-muted-foreground" />
            </div>
            <Button variant="ghost" size="icon">
              <IconBell className="h-4 w-4" />
            </Button>
          </div>
        </Sidebar.Content>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  );
}
