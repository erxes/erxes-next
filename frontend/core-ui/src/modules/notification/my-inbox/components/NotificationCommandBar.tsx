import { selectedNotificationsState } from '@/notification/my-inbox/states/notificationState';
import { IconEyeCheck, IconTrash } from '@tabler/icons-react';
import { Button, CommandBar, Separator } from 'erxes-ui';
import { useAtom } from 'jotai';

export const NotificationsCommandBar = () => {
  const [selectedNotifications, setSelectedNotifications] = useAtom(
    selectedNotificationsState,
  );
  return (
    <CommandBar open={selectedNotifications.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value onClose={() => setSelectedNotifications([])}>
          {selectedNotifications.length} selected
        </CommandBar.Value>
        <Separator.Inline />
        <Button variant="ghost">
          <IconEyeCheck />
          Mark as read
        </Button>
        <Separator.Inline />
        <Button variant="ghost" className="text-destructive">
          <IconTrash />
          Delete selected
        </Button>
        <Button variant="ghost" className="text-destructive">
          <IconTrash />
          Delete all
        </Button>
      </CommandBar.Bar>
    </CommandBar>
  );
};
