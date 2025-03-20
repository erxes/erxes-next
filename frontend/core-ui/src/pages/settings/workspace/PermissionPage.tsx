import { IconPlus, IconTool, IconUserShield } from '@tabler/icons-react';
import { Button, SettingsHeader } from 'erxes-ui';
import { Permission } from '~/modules/settings/permission/components/Permission';

export function PermissionPage() {
  return (
    <section className="mx-auto flex w-full h-screen relative">
      {/* <PermissionSidebar /> */}
      <div className="flex flex-col h-full w-full">
        <SettingsHeader>
          <Button variant="ghost" className="font-semibold">
            <IconUserShield className="w-4 h-4 text-accent-foreground" />
            Permission
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
        <div className="flex h-full">
          <Permission />
        </div>
      </div>
    </section>
  );
}
