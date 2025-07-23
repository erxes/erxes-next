import { NOTIFICATION_DETAIL } from '@/notification/my-inbox/graphql/notificationsQueries';
import { INotification } from '@/notification/my-inbox/types/notifications';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';

export const useNotification = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<{ notificationDetail: INotification }>(
    NOTIFICATION_DETAIL,
    { variables: { _id: id }, skip: !id },
  );

  return {
    id,
    notification: data?.notificationDetail,
    loading,
  };
};
