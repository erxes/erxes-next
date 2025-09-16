import { useUnreadNotificationCount } from '@/notification/my-inbox/hooks/useUnreadNotificationCount';
import { IconInbox } from '@tabler/icons-react';
import {
  NavigationMenuLinkItem,
  Skeleton,
  Button,
  DropdownMenu,
} from 'erxes-ui';
import { useTranslation } from 'react-i18next';
import { IconDotsVertical, IconSettings } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

export const MyInboxNavigationItem = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="relative group/trigger">
      <NavigationMenuLinkItem
        path="my-inbox"
        name={t('My inbox')}
        icon={IconInbox}
      >
        <NotificationCount />
      </NavigationMenuLinkItem>

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="invisible group-hover/trigger:visible absolute top-1/2 -translate-y-1/2 right-1 text-muted-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <IconDotsVertical className="size-4" />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          side="right"
          align="start"
          className="w-60 min-w-0"
        >
          <DropdownMenu.Item
            className="cursor-pointer"
            onSelect={() => navigate(`settings/inbox/integrations`)}
          >
            <IconSettings className="size-4" />
            Go to inbox settings
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

export const NotificationCount = () => {
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
