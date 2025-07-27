import { IconPlayerPlay, IconPower } from '@tabler/icons-react';
import { Badge, Button } from 'erxes-ui';

export const CallWidgetActions = () => {
  return (
    <div className="flex items-center gap-2">
      <SipStatusBadge />
      <Button size="sm" variant="outline" className="ml-auto">
        <IconPlayerPlay /> unpause
      </Button>
      <Button size="sm" variant="secondary">
        <IconPower /> turn off
      </Button>
    </div>
  );
};

export const SipStatusBadge = () => {
  return <Badge variant="success">Online</Badge>;
};
