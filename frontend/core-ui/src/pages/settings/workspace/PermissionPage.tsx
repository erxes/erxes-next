import {
  IconLayoutSidebar,
  IconMinusVertical,
  IconPlus,
  IconStar,
  IconTool,
} from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { Permission } from '~/modules/settings/permission/components/Permission';
import { SettingsBreadcrumbs } from '~/modules/settings/components/SettingsBreadcrumbs';

export function PermissionPage() {
  return (
    <section className="mx-auto w-full h-[calc(100vh-64px)] relative">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <IconLayoutSidebar />
          </Button>
          <SettingsBreadcrumbs />
          <IconMinusVertical size={14} className="stroke-black" />
          <IconStar size={16} className="stroke-accent-foreground stroke-2" />
        </div>
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" className="border">
            <IconTool />
            Fix Permission
          </Button>
          <Button type="button">
            <IconPlus />
            New Permission
          </Button>
        </div>
      </div>
      <Permission />
    </section>
  );
}
