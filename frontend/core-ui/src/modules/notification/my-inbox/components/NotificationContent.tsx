import { NoNotificationSelected } from '@/notification/my-inbox/components/NoNotificationSelected';
import { NotificationContentSkeleton } from '@/notification/my-inbox/components/NotificationContentSkeleton';
import { Notifications } from '@/notification/my-inbox/components/Notifications';
import { useNotification } from '@/notification/my-inbox/hooks/useNotification';
import {
  IconLayoutSidebarLeftExpand,
  IconNotificationOff,
} from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const NotificationContent = () => {
  const { notification, loading } = useNotification();

  if (loading) {
    return <NotificationContentSkeleton />;
  }
  if (!notification) {
    return <NoNotificationSelected />;
  }
  const { contentType = '' } = notification || {};

  const [pluginName, moduleName] = (contentType || '')
    .replace(':', '.')
    .split('.');

  return (
    <div className="flex flex-col h-full">
      <PageHeader className="sm:justify-end flex items-center gap-2 flex-none pr-8">
        <PageHeader.End>
          <Button variant="outline">
            <IconNotificationOff /> Delete Notification
          </Button>
          <div id="notifications-actions-slot" className="flex gap-2" />
        </PageHeader.End>
      </PageHeader>

      <div className="flex-grow overflow-hidden">
        <RenderPluginsComponent
          pluginName={`${pluginName}_ui`}
          remoteModuleName="notificationWidget"
          moduleName={moduleName}
          props={notification}
        />
      </div>
    </div>
  );
};
