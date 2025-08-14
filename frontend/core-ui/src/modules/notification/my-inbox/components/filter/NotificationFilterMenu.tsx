import { Command, Filter, ToggleGroup, useQueryState } from 'erxes-ui';
import {
  IconCalendar,
  IconEyeCancel,
  IconEyeCheck,
  IconEyeSearch,
  IconEyeUp,
  IconNotification,
  IconUserUp,
} from '@tabler/icons-react';

export const NotificationFilterMenu = () => {
  const [status, setStatus] = useQueryState<string>('status');

  return (
    <Filter.View>
      <Command>
        <Filter.CommandInput
          placeholder="Filter"
          variant="secondary"
          className="bg-background"
        />
        <Command.List>
          <ToggleGroup
            type="single"
            value={status || 'unread'}
            onValueChange={(value) => setStatus(value)}
          >
            <ToggleGroup.Item
              aria-label="Toggle unread"
              value="unread"
              className="flex-1"
            >
              <IconEyeCheck />
              Unread
            </ToggleGroup.Item>
            <ToggleGroup.Item
              aria-label="Toggle Read"
              value="read"
              className="flex-1"
            >
              <IconEyeCancel />
              Read
            </ToggleGroup.Item>
            <ToggleGroup.Item
              aria-label="Toggle all"
              value="all"
              className="flex-1"
            >
              <IconEyeSearch />
              All
            </ToggleGroup.Item>
          </ToggleGroup>
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
        </Command.List>
        <Command.Separator className="my-1" />

        <Command.List className="p-1">
          <Filter.Item value="fromUserId">
            <IconUserUp />
            Filter by sender
          </Filter.Item>
        </Command.List>
      </Command>
    </Filter.View>
  );
};
