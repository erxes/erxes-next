import { CoreNotificationContent } from '@/notification/my-inbox/components/contents/CoreNotificationContent';
import { SystemNotificationContents } from '@/notification/my-inbox/components/contents/system/SystemNotificationContents';
import { UnknownSystemNotificationContent } from '@/notification/my-inbox/components/contents/system/UnknownSystemNotificationContent';
import { NoNotificationSelected } from '@/notification/my-inbox/components/NoNotificationSelected';
import { NotificationContentSkeleton } from '@/notification/my-inbox/components/NotificationContentSkeleton';
import { useArchiveNotification } from '@/notification/my-inbox/hooks/useArchiveNotification';
import { useNotification } from '@/notification/my-inbox/hooks/useNotification';
import {
  INotification,
  INotificationKind,
} from '@/notification/my-inbox/types/notifications';
import {
  IconMailCheck,
  IconMailX,
  IconNotificationOff,
} from '@tabler/icons-react';
import { Button, cn, Label, Tooltip } from 'erxes-ui';
import { Suspense } from 'react';
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
  const { emailDelivery } = notification || {};

  return (
    <div className="flex flex-col h-full">
      <PageHeader className="sm:justify-end flex items-center gap-2 flex-none pr-8">
        {emailDelivery && (
          <div className="mr-auto font-semibold text-accent-foreground text-xs flex items-center gap-2">
            <span>Email Delivery:</span>
            <Tooltip.Provider>
              <Tooltip>
                <Tooltip.Trigger>
                  {emailDelivery?.error ? (
                    <IconMailX className="size-4 text-destructive" />
                  ) : (
                    <IconMailCheck className="size-4 text-success" />
                  )}
                </Tooltip.Trigger>
                <Tooltip.Content>
                  {emailDelivery?.error
                    ? emailDelivery?.error
                    : emailDelivery.status}
                </Tooltip.Content>
              </Tooltip>
            </Tooltip.Provider>
          </div>
        )}
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
        <NotificationContentWrapper notification={notification} />
      </div>
    </div>
  );
};

const NotificationContentWrapper = ({
  notification,
}: {
  notification: INotification;
}) => {
  if (notification.kind === INotificationKind.SYSTEM) {
    const { template = '' } = notification?.metadata || {};

    const SystemComponent =
      SystemNotificationContents[
        template as keyof typeof SystemNotificationContents
      ];
    return SystemComponent ? (
      <Suspense fallback={<NotificationContentSkeleton />}>
        <SystemComponent />
      </Suspense>
    ) : (
      <UnknownSystemNotificationContent />
    );
  }

  const [pluginName, moduleName, collectionType] = (
    notification?.contentType || ''
  )
    .replace(':', '.')
    .split('.');

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
