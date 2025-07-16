import { NotificationPriorityCommandBar } from '@/notification/my-inbox/components/filter/NotificationPriorityCommandBar';
import { NotificationTypeCommandBar } from '@/notification/my-inbox/components/filter/NotificationTypeCommandBar';
import { MyInboxHotkeyScope } from '@/notification/my-inbox/types/notifications';
import {
  IconCalendarPlus,
  IconEyeUp,
  IconNotification,
} from '@tabler/icons-react';
import { Filter, PageSubHeader, Popover, useMultiQueryState } from 'erxes-ui';

export const NotificationFilterBar = () => {
  const [queries, setQueries] = useMultiQueryState<{
    priority?: string;
    type?: string;
    createdAt: string;
    module: string;
  }>(['priority', 'type', 'createdAt', 'module']);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );

  if (!hasFilters) {
    return null;
  }

  return (
    <PageSubHeader className="p-2 overflow-x-auto">
      <Filter id={MyInboxHotkeyScope.MainPage}>
        <Filter.Bar className="flex-nowrap">
          {!!queries.type && (
            <Filter.BarItem>
              <Filter.BarName className="whitespace-nowrap">
                <IconNotification />
                Notification Type
              </Filter.BarName>
              <Popover>
                <Popover.Trigger>
                  <Filter.BarButton filterKey="type">
                    {queries.type}
                  </Filter.BarButton>
                </Popover.Trigger>
                <Popover.Content className="p-0">
                  <NotificationTypeCommandBar
                    type={queries.type || ''}
                    setQueries={setQueries}
                  />
                </Popover.Content>
              </Popover>
              <Filter.BarClose filterKey="type" />
            </Filter.BarItem>
          )}
          {!!queries.priority && (
            <Filter.BarItem>
              <Filter.BarName className="whitespace-nowrap">
                <IconEyeUp />
                Priority
              </Filter.BarName>
              <Popover>
                <Popover.Trigger>
                  <Filter.BarButton filterKey="priority">
                    {queries.priority}
                  </Filter.BarButton>
                </Popover.Trigger>
                <Popover.Content className="p-0">
                  <NotificationPriorityCommandBar
                    priority={queries.priority || ''}
                    setQueries={setQueries}
                  />
                </Popover.Content>
              </Popover>
              <Filter.BarClose filterKey="priority" />
            </Filter.BarItem>
          )}
          {!!queries.createdAt && (
            <Filter.BarItem>
              <Filter.BarName className="whitespace-nowrap">
                <IconCalendarPlus />
                Filter by created at
              </Filter.BarName>
              <Filter.Date filterKey="createdAt" />
              <Filter.BarClose filterKey="createdAt" />
            </Filter.BarItem>
          )}
        </Filter.Bar>
      </Filter>
    </PageSubHeader>
  );
};
