import { IconMailbox } from '@tabler/icons-react';
import { Label } from 'erxes-ui';

export const NotificationContentSkeleton = () => {
  return (
    <div className="w-full h-full text-accent-foreground items-center justify-center flex flex-col animate-pulse">
      <IconMailbox size={97} />
      <Label>Loading ... </Label>
    </div>
  );
};
