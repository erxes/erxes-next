import { NoNotificationSelected } from '@/notification/my-inbox/components/NoNotificationSelected';
import { NOTIFICATION } from '@/notification/my-inbox/graphql/notificationsQueries';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { useQuery } from '@apollo/client';
import { Spinner } from 'erxes-ui';
import { useParams } from 'react-router';
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

  console.log({ pluginName, moduleName, notification });
  return (
    <>
      <RenderPluginsComponent
        pluginName={`${pluginName}_ui`}
        remoteModuleName="notificationWidget"
        moduleName={moduleName}
        props={notification}
      />
    </>
  );
};

const useNotification = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<{ notification: INotification }>(
    NOTIFICATION,
    { variables: { _id: id } },
  );

  return {
    notification: data?.notification,
    loading,
  };
};
