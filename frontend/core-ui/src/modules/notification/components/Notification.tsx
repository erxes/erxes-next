import { IconBellFilled } from '@tabler/icons-react';
import { Button } from 'erxes-ui';

export const Notification = () => {
  return (
    <Button variant="secondary" size="icon">
      <IconBellFilled className="h-4 w-4" />
    </Button>
  );
};
