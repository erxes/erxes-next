import { IconBell, IconBellFilled, IconSelector } from '@tabler/icons-react';
import { currentOrganizationState } from 'erxes-ui-shared-states';

import { Button, Sidebar } from 'erxes-ui/components';

import { Logo } from '@/auth/components/Logo';
import { useAtom } from 'jotai';

export function Organization() {
  const [currentOrganization] = useAtom(currentOrganizationState);

  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.Content>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-auto">
              <div className="flex aspect-square size-7 rounded items-center justify-center overflow-hidden bg-primary">
                <Logo
                  organizationLogo={currentOrganization?.logo}
                  className="size-6 rounded-lg text-background"
                />
              </div>
              <div className="text-[13px] flex flex-col">
                <span className="font-medium truncate">
                  {currentOrganization?.name || 'Erxes Inc'}
                </span>
              </div>
            </div>
            <Button variant="secondary" size="icon">
              <IconBellFilled className="h-4 w-4" />
            </Button>
          </div>
        </Sidebar.Content>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  );
}
