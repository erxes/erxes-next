import { useUnreadNotificationCount } from '@/notification/my-inbox/hooks/useUnreadNotificationCount';
import { IconMailbox } from '@tabler/icons-react';
import { cn, Sidebar, Spinner } from 'erxes-ui';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

export const MyInboxMainNavigationBarItem = () => {
  const { pathname: activePathname } = useLocation();

  const { t } = useTranslation();
  const isActive = activePathname.includes('/my-inbox');

  const { unreadNotificationsCount, loading } = useUnreadNotificationCount();

  return (
    <>
      <Sidebar.Group>
        <Sidebar.Menu>
          <Sidebar.MenuItem key={'my-inbox'}>
            <Sidebar.MenuButton
              asChild
              isActive={isActive}
              className={cn(isActive && 'bg-muted')}
            >
              <Link to={'/my-inbox'}>
                <IconMailbox
                  className={cn(
                    'text-accent-foreground',
                    isActive && 'text-primary',
                  )}
                />
                <span className="capitalize">{t('My inbox')}</span>{' '}
                {loading ? (
                  <Spinner />
                ) : (
                  <span className="ml-auto text-xs mr-2">
                    {unreadNotificationsCount || ''}
                  </span>
                )}
              </Link>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
    </>
  );
};
