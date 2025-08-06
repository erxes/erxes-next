import { NotificationFilterBar } from '@/notification/my-inbox/components/filter/NotificationFilterBar';
import { NotificationsFilters } from '@/notification/my-inbox/components/filter/NotificationsFilters';
import { NotificationAdjustments } from '@/notification/my-inbox/components/NotificationAdjustments';
import { NotificationsSelectAll } from '@/notification/my-inbox/components/NotificationsSelectAll';
import { NotificationsCountLabel } from '@/notification/my-inbox/components/NotificationUnreadCount';
import { PageHeader } from 'ui-modules';

export const NotificationSidebarToolbar = () => {
  return (
    <>
      <PageHeader>
        <div className="flex flex-row items-center">
          <NotificationsSelectAll />
          <NotificationsCountLabel />
        </div>
        <PageHeader.End>
          <NotificationsFilters />
          <NotificationAdjustments />
        </PageHeader.End>
      </PageHeader>
      <NotificationFilterBar />
    </>
  );
};
