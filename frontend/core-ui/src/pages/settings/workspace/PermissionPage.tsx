import { IconPlus, IconTool, IconUserShield } from '@tabler/icons-react';
import { Button, PageContainer } from 'erxes-ui';
import { Permission } from '@/settings/permission/components/Permission';
import { SettingsHeader } from 'ui-modules';
import { UsersGroupSidebar } from '@/settings/permission/components/UsersGroupSidebar';

export function PermissionPage() {
  return (
    <PageContainer className="flex-row">
      <UsersGroupSidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <SettingsHeader breadcrumbs={[]}>
          <Button variant="ghost" className="font-semibold">
            <IconUserShield className="w-4 h-4 text-accent-foreground" />
            Permissions
          </Button>
          <div className="flex items-center gap-4 ml-auto">
            <Button type="button" variant="ghost" className="border">
              <IconTool />
              Fix Permission
            </Button>
            <Button type="button">
              <IconPlus />
              New Permission
            </Button>
          </div>
        </SettingsHeader>
        <div className="flex flex-auto w-full overflow-hidden">
          <Permission />
        </div>
      </div>
    </PageContainer>
  );
}
