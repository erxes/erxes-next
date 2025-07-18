import { CoreNotificationContent } from '@/notification/my-inbox/components/contents/CoreNotificationContent';
import { NoNotificationSelected } from '@/notification/my-inbox/components/NoNotificationSelected';
import { NotificationContentSkeleton } from '@/notification/my-inbox/components/NotificationContentSkeleton';
import { useArchiveNotification } from '@/notification/my-inbox/hooks/useArchiveNotification';
import { useNotification } from '@/notification/my-inbox/hooks/useNotification';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { IconNotificationOff } from '@tabler/icons-react';
import { Button, cn } from 'erxes-ui';
import { ErrorBoundary } from 'react-error-boundary';
import { PageHeader } from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const NotificationContent = () => {
  const { notification, loading } = useNotification();
  const { loading: archiveLoading, archiveNotification } =
    useArchiveNotification();

  if (loading) {
    return <NotificationContentSkeleton />;
  }
  if (!notification) {
    return <NoNotificationSelected />;
  }
  const { contentType = '' } = notification || {};

  const [pluginName, moduleName, collectionType] = (contentType || '')
    .replace(':', '.')
    .split('.');

  return (
    <div className="flex flex-col h-full">
      <PageHeader className="sm:justify-end flex items-center gap-2 flex-none pr-8">
        <PageHeader.End>
          <Button
            variant="outline"
            disabled={archiveLoading}
            onClick={() => archiveNotification(notification._id)}
            className={cn({ 'animate-pulse': archiveLoading })}
          >
            <IconNotificationOff /> Archive
          </Button>
          <ErrorBoundary
            FallbackComponent={({ error }) => (
              <p className="text-destructive font-semibold">{error?.message}</p>
            )}
          >
            <div id="notifications-actions-slot" className="flex gap-2" />
          </ErrorBoundary>
        </PageHeader.End>
      </PageHeader>

      <div className="flex-grow overflow-hidden">
        <NotificationContentWrapper
          pluginName={pluginName}
          moduleName={moduleName}
          collectionType={collectionType}
          notification={notification}
        />
      </div>
    </div>
  );
};

const NotificationContentWrapper = ({
  pluginName,
  moduleName,
  collectionType,
  notification,
}: {
  pluginName: string;
  moduleName: string;
  collectionType: string;
  notification: INotification;
}) => {
  if (pluginName === 'core') {
    const CoreNotificationComponent =
      CoreNotificationContent[
        collectionType as keyof typeof CoreNotificationContent
      ] ?? (() => <></>);
    return <CoreNotificationComponent {...notification} />;
  }

  return (
    <RenderPluginsComponent
      pluginName={`${pluginName}_ui`}
      remoteModuleName="notificationWidget"
      moduleName={moduleName}
      props={notification}
    />
  );
};
