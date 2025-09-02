import { Separator } from 'erxes-ui';

type Props = {
  Notifications: React.ComponentType;
  NotificationContent: React.ComponentType;
};

export const MyInboxLayout = ({
  Notifications,
  NotificationContent,
}: Props) => (
  <div className="flex-auto flex">
    <div className="flex-none w-72">
      <Notifications />
    </div>
    <Separator orientation="vertical" />
    <div className="flex-auto">
      <NotificationContent />
    </div>
  </div>
);
