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
  const [{ sort, orderBy }, setQueries] = useMultiQueryState<{
    orderBy: string;
    sort: number;
  }>(['orderBy', 'sort']);

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

        {!['new', 'old'].includes(orderBy || '') && (
          <div className="flex items-center justify-between space-x-4">
            <Label htmlFor="sort-toggle">Sort</Label>
            <Toggle
              id="sort-toggle"
              variant="outline"
              className="flex items-center gap-1 px-3 py-1.5 h-8"
              pressed={sort === -1}
              onPressedChange={() => setQueries({ sort: sort === -1 ? 1 : -1 })}
              disabled={loading}
            >
              {loading ? (
                'Resolving'
              ) : sort === -1 ? (
                <>
                  <IconSortDescending className="w-4 h-4" />
                  <span>Descending</span>
                </>
              ) : (
                <>
                  <IconSortAscending className="w-4 h-4" />
                  <span>Ascending</span>
                </>
              )}
            </Toggle>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
