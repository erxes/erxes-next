import { NotificationAdjustments } from '@/notification/my-inbox/components/NotificationAdjustments';
import { NotificationsFilters } from '@/notification/my-inbox/components/NotificationsFilters';
import { NotificationsSelectAll } from '@/notification/my-inbox/components/NotificationsSelectAll';
import { UnreadNotificationsCount } from '@/notification/my-inbox/components/NotificationUnreadCount';
import { Checkbox, Tabs } from 'erxes-ui';
import { PageHeader } from 'ui-modules';

export const NotificationSidebarToolbar = () => {
  return (
    <PageHeader>
      {/* <PageHeader.Start> */}
      <div className="flex flex-row items-center">
        <NotificationsSelectAll />
        <UnreadNotificationsCount />
      </div>
      {/* </PageHeader.Start> */}
      <PageHeader.End>
        <NotificationsFilters />
        <NotificationAdjustments />
      </PageHeader.End>
    </PageHeader>
  );
};
