import { useNotificationsListContext } from '@/notification/my-inbox/context/NotificationsListContext';
import {
  IconAdjustmentsHorizontal,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react';
import {
  Button,
  Label,
  Popover,
  Select,
  Toggle,
  useMultiQueryState,
} from 'erxes-ui';

export const NotificationAdjustments = () => {
  const { loading } = useNotificationsListContext();
  const [{ orderBy }, setQueries] = useMultiQueryState<{
    orderBy: string;
  }>(['orderBy']);

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
            </Select.Content>
          </Select>
        </div>
      </Popover.Content>
    </Popover>
  );
};
