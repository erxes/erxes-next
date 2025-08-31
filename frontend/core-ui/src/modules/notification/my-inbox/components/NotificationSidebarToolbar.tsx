import { NotificationFilterBar } from '@/notification/my-inbox/components/filter/NotificationFilterBar';
import { NotificationsFilters } from '@/notification/my-inbox/components/filter/NotificationsFilters';
import { NotificationAdjustments } from '@/notification/my-inbox/components/NotificationAdjustments';
import { NotificationsSelectAll } from '@/notification/my-inbox/components/NotificationsSelectAll';
import { NotificationsCountLabel } from '@/notification/my-inbox/components/NotificationUnreadCount';

export const NotificationSidebarToolbar = () => {
  return (
    <div className="p-2 space-y-1 bg-sidebar">
      <div className="flex items-center">
        <NotificationsSelectAll />
        <NotificationsCountLabel />
        <div className="ml-auto">
          <NotificationsFilters />
          <NotificationAdjustments />
        </div>
      </div>
      <NotificationFilterBar />
    </div>
  );
};
