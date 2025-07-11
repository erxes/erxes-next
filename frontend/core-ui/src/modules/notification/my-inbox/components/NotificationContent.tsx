import { NoNotificationSelected } from '@/notification/my-inbox/components/NoNotificationSelected';
import { Notifications } from '@/notification/my-inbox/components/Notifications';
import { NOTIFICATION_DETAIL } from '@/notification/my-inbox/graphql/notificationsQueries';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { useQuery } from '@apollo/client';
import {
  IconLayoutSidebarLeftExpand,
  IconNotificationOff,
} from '@tabler/icons-react';
import { Button, Sheet, Spinner } from 'erxes-ui';
import { useParams } from 'react-router';
import { PageHeader } from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const NotificationContent = () => {
  const { notification, loading } = useNotification();

  if (loading) {
    return <Spinner />;
  }
  if (!notification) {
    return <NoNotificationSelected />;
  }
  const { contentType } = notification;

  const [pluginName, moduleName] = (contentType || '')
    .replace(':', '.')
    .split('.');

  return (
    <div className="flex flex-col h-full">
      <PageHeader className="sm:justify-end flex items-center gap-2 flex-none pr-8">
        <div className="block sm:hidden">
          <Sheet>
            <Sheet.Trigger asChild>
              <Button variant="ghost" size="icon">
                <IconLayoutSidebarLeftExpand />
              </Button>
            </Sheet.Trigger>
            <Sheet.View side="left">
              <Sheet.Content>
                <Notifications />
              </Sheet.Content>
            </Sheet.View>
          </Sheet>
        </div>
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

const useNotification = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<{ notificationDetail: INotification }>(
    NOTIFICATION_DETAIL,
    { variables: { _id: id }, skip: !id },
  );

  console.log({ asda: data?.notificationDetail });
  return {
    notification: data?.notificationDetail,
    loading,
  };
};
