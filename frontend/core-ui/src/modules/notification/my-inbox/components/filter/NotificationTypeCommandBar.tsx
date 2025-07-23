import { NOTIFICATION_TYPE_ICONS } from '@/notification/my-inbox/constants/notifications';
import { IconCheck } from '@tabler/icons-react';
import { Command } from 'erxes-ui';

export const NotificationTypeCommandBar = ({
  type,
  setQueries,
}: {
  type?: string;
  setQueries: (
    values: Partial<{
      type?: string | null;
    }>,
  ) => void;
}) => {
  return (
    <Command shouldFilter={false}>
      <Command.List>
        <Command.Empty />
        {['info', 'success', 'warning', 'error'].map((value) => {
          const Icon =
            NOTIFICATION_TYPE_ICONS[
              value as keyof typeof NOTIFICATION_TYPE_ICONS
            ];
          return (
            <Command.Item
              key={value}
              value={value}
              className={`cursor-pointer`}
              onSelect={() =>
                setQueries({ type: type === value ? null : value })
              }
            >
              <Icon />
              <span className="capitalize">{value}</span>
              {type === value && <IconCheck className="ml-auto" />}
            </Command.Item>
          );
        })}
      </Command.List>
    </Command>
  );
};
