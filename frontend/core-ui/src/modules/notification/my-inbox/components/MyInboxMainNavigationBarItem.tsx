import { useUnreadNotificationCount } from '@/notification/my-inbox/hooks/useUnreadNotificationCount';
import { IconInbox, IconMailbox } from '@tabler/icons-react';
import { NavigationMenuLinkItem, Sidebar, Skeleton } from 'erxes-ui';
import { useTranslation } from 'react-i18next';

export const MyInboxMainNavigationBarItem = () => {
  const { t } = useTranslation();

  return (
    <>
      <Sidebar.Group>
        <Sidebar.Menu>
          <NavigationMenuLinkItem
            path={'my-inbox'}
            name={t('My inbox')}
            icon={IconInbox}
            children={<MyInboxMainNavigationBarItemIcon />}
          />
        </Sidebar.Menu>
      </Sidebar.Group>
      <Sidebar.Separator />
    </>
  );
};

export const MyInboxMainNavigationBarItemIcon = () => {
  const { unreadNotificationsCount, loading } = useUnreadNotificationCount();

  return (
    <span className="ml-auto text-xs">
      {loading ? (
        <Skeleton className="size-4 rounded-sm" />
      ) : (
        unreadNotificationsCount || ''
      )}
    </span>
  );
};
