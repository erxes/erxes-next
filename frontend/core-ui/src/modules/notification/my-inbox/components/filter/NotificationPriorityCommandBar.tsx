import { IconCheck } from '@tabler/icons-react';
import { Command } from 'erxes-ui';

export const NotificationPriorityCommandBar = ({
  priority,
  setQueries,
}: {
  priority?: string;
  setQueries: (
    values: Partial<{
      priority?: string | null;
    }>,
  ) => void;
}) => {
  return (
    <Command shouldFilter={false}>
      <Command.List>
        <Command.Empty />
        {['low', 'medium', 'high', 'urgent'].map((value) => (
          <Command.Item
            key={value}
            value={value}
            className={`cursor-pointer`}
            onSelect={() =>
              setQueries({ priority: priority === value ? null : value })
            }
          >
            <span className="capitalize">{value}</span>
            {priority === value && <IconCheck className="ml-auto" />}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
};
