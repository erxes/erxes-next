import {
  IconCalendar,
  IconCheck,
  IconEyeCancel,
  IconEyeCheck,
  IconEyeSearch,
  IconEyeUp,
  IconNotification,
  IconPuzzle,
} from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';
export const NotificationsFilters = () => {
  const [queries, setQueries] = useMultiQueryState<{
    status: 'read' | 'unread' | 'all';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    type: 'info' | 'success' | 'warning' | 'error';
    fromDate: string;
    endDate: string;
    module: string;
  }>(['status', 'priority', 'type', 'fromDate', 'endDate', 'module']);

  const { status, priority, type, fromDate, endDate, module } = queries;
  return (
    <Filter id="my-inbox-main-filter">
      <Filter.Popover scope="my-inbox-main-filter">
        <Filter.Trigger isFiltered />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Filter.CommandInput
                placeholder="Filter"
                variant="secondary"
                className="bg-background"
              />
              <Command.List>
                <Filter.CommandItem
                  onSelect={() => setQueries({ status: 'unread' })}
                >
                  <IconEyeCheck />
                  Unread notifications
                  {status === null && <IconCheck className="ml-auto" />}
                </Filter.CommandItem>
                <Filter.CommandItem
                  onSelect={() => setQueries({ status: 'read' })}
                >
                  <IconEyeCancel />
                  Read notifications
                  {status === 'read' && <IconCheck className="ml-auto" />}
                </Filter.CommandItem>

                <Filter.CommandItem
                  onSelect={() => setQueries({ status: 'all' })}
                >
                  <IconEyeSearch />
                  All notifications
                  {status === 'all' && <IconCheck className="ml-auto" />}
                </Filter.CommandItem>
              </Command.List>
              <Command.Separator className="my-1" />
              <Command.List className="p-1">
                <Filter.Item value="type">
                  <IconNotification />
                  Notification Type
                </Filter.Item>
                <Filter.Item value="priority">
                  <IconEyeUp />
                  Priority
                </Filter.Item>

                <Filter.Item value="createdAt">
                  <IconCalendar />
                  Filter by date
                </Filter.Item>
                <Filter.Item value="plugins">
                  <IconPuzzle />
                  Plugins
                </Filter.Item>
              </Command.List>
            </Command>
          </Filter.View>
        </Combobox.Content>
      </Filter.Popover>
    </Filter>
  );
};
