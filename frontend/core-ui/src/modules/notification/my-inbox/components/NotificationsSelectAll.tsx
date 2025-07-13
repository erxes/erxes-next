import { useNotificationsListContext } from '@/notification/my-inbox/context/NotificationsListContext';
import { selectedNotificationsState } from '@/notification/my-inbox/states/notificationState';
import { Checkbox } from 'erxes-ui';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

export const NotificationsSelectAll = () => {
  const { notifications } = useNotificationsListContext();
  const [selectedNotifications, setSelectedNotifications] = useAtom(
    selectedNotificationsState,
  );
  const [searchParams] = useSearchParams();

  // Reset selection when search params change
  useEffect(() => {
    setSelectedNotifications([]);
  }, [searchParams, setSelectedNotifications]);

  const isAllSelected =
    notifications?.length > 0 &&
    selectedNotifications.length === notifications?.length;
  const isSomeSelected = selectedNotifications.length > 0;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      const notificationIds = notifications.map(
        (notification) => notification._id,
      );
      setSelectedNotifications(notificationIds);
    } else {
      setSelectedNotifications([]);
    }
  };

  return (
    <Checkbox
      disabled={!notifications?.length}
      checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
      onCheckedChange={handleCheckboxChange}
      className="mx-2"
    />
  );
};
