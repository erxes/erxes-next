import { Resizable } from 'erxes-ui';

type Props = {
  Notifications: React.ComponentType;
  NotificationContent: React.ComponentType;
};

export const MyInboxLayout = ({
  Notifications,
  NotificationContent,
}: Props) => (
  <Resizable.PanelGroup
    direction="horizontal"
    className="flex-1 overflow-hidden"
  >
    <Resizable.Panel minSize={20} defaultSize={30} className="hidden sm:flex">
      <Notifications />
    </Resizable.Panel>
    <Resizable.Handle />
    <Resizable.Panel minSize={20} defaultSize={70}>
      <NotificationContent />
    </Resizable.Panel>
  </Resizable.PanelGroup>
);
