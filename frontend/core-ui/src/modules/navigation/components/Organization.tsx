import { IconBellFilled } from '@tabler/icons-react';
import { currentOrganizationState } from 'ui-modules';

import { Button, Sidebar, TextOverflowTooltip } from 'erxes-ui';

import { Logo } from '@/auth/components/Logo';
import { useAtom } from 'jotai';

export function Organization() {
  const [currentOrganization] = useAtom(currentOrganizationState);

  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem className="flex gap-2 items-center overflow-hidden p-2">
        <div className="flex items-center gap-2 flex-auto overflow-hidden">
          <div className="flex aspect-square size-7 rounded items-center justify-center overflow-hidden bg-primary flex-none">
            <Logo
              organizationLogo={currentOrganization?.logo}
              className="size-6 rounded-lg text-background"
            />
          </div>

          <TextOverflowTooltip
            value={currentOrganization?.name || 'Erxes Inc'}
            className="font-medium text-sm"
          />
        </div>
        <Button variant="secondary" size="icon">
          <IconBellFilled className="h-4 w-4" />
        </Button>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  );
}
