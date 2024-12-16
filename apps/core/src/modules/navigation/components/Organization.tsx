import { Sidebar } from 'erxes-ui/components';
import { currentOrganizationState } from 'erxes-shared-states';
import { useRecoilValue } from 'recoil';
import { Logo } from '@/auth/components/Logo';

export function Organization() {
  const currentOrganization = useRecoilValue(currentOrganizationState);

  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.Content>
          <div className="flex items-center gap-2 px-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-system text-system-foreground">
              <Logo
                organizationLogo={currentOrganization?.logo}
                className="size-8 rounded-md bg-system text-system-foreground"
              />
            </div>
            <div className="text-sm flex flex-col">
              <span className="font-medium truncate">
                {currentOrganization?.name || 'erxes'}
              </span>
            </div>
          </div>
        </Sidebar.Content>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  );
}
