import { Command, Filter, useQueryState } from 'erxes-ui';
import {
  IconCalendar,
  IconCheck,
  IconEyeCancel,
  IconEyeCheck,
  IconEyeSearch,
  IconEyeUp,
  IconNotification,
  IconPuzzle,
  IconUserUp,
} from '@tabler/icons-react';

export const NotificationFilterMenu = () => {
  const [status, setStatus] = useQueryState<string>('status');

  console.log({ status });

  return (
    <Filter.View>
      <Command>
        <Filter.CommandInput
          placeholder="Filter"
          variant="secondary"
          className="bg-background"
        />
        <Command.List>
          <Filter.CommandItem onSelect={() => setStatus('unread')}>
            <IconEyeCheck />
            Unread notifications
            {[null, 'unread'].includes(status) && (
              <IconCheck className="ml-auto" />
            )}
          </Filter.CommandItem>
          <Filter.CommandItem onSelect={() => setStatus('read')}>
            <IconEyeCancel />
            Read notifications
            {status === 'read' && <IconCheck className="ml-auto" />}
          </Filter.CommandItem>

          <Filter.CommandItem onSelect={() => setStatus('all')}>
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
