import { useNotificationsListContext } from '@/notification/my-inbox/context/NotificationsListContext';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { Button, Label, Popover, Select, useMultiQueryState } from 'erxes-ui';

export const NotificationAdjustments = () => {
  const { loading } = useNotificationsListContext();
  const [{ orderBy, status }, setQueries] = useMultiQueryState<{
    orderBy: string;
    status: 'read' | 'unread' | 'all';
  }>(['orderBy', 'status']);

  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon">
          <IconAdjustmentsHorizontal className="size-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <Label>Ordering</Label>
          <Select
            defaultValue={orderBy || 'new'}
            disabled={loading}
            onValueChange={(value) =>
              setQueries({ orderBy: value === orderBy ? null : value })
            }
          >
            <Select.Trigger className="h-4 w-24">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="new">Newest</Select.Item>
              <Select.Item value="old">Oldest</Select.Item>
              <Select.Item value="priority">Priority</Select.Item>
              {status && status !== 'unread' && (
                <Select.Item value="readAt">Read at</Select.Item>
              )}
            </Select.Content>
          </Select>
        </div>
      </Popover.Content>
    </Popover>
  );
};
