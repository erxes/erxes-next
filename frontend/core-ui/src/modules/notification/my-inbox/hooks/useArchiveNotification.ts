import { ARCHIVE_NOTIFICATION } from '@/notification/my-inbox/graphql/notificationMutations';
import { selectedNotificationsState } from '@/notification/my-inbox/states/notificationState';
import { useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';
import { useAtom } from 'jotai';
import { useNavigate, useSearchParams } from 'react-router';

export const useArchiveNotification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [archive, { loading }] = useMutation(ARCHIVE_NOTIFICATION);
  const [selectedNotifications, setSelectedNotifications] = useAtom(
    selectedNotificationsState,
  );

  const archiveNotification = (id: string) => {
    archive({
      variables: { id },
    })
      .then(() => {
        const queryString = searchParams.toString();

        toast({ title: 'Archived successfully' });

        setSelectedNotifications(
          selectedNotifications.filter((notifId) => notifId !== id),
        );

        navigate(`/my-inbox${queryString ? `?${queryString}` : ''}`);
      })
      .catch((error) =>
        toast({ title: 'Something went wrong', description: error?.message }),
      );
  };

  return {
    archiveNotification,
    loading,
  };
};
