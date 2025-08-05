import { IconArrowUpRight } from '@tabler/icons-react';
import { Button } from 'erxes-ui';

export const CallDisconnected = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-10 flex items-center gap-1 px-1.5 text-sm">
      <div className="mr-auto">
        <Button variant="ghost" className="text-primary gap-1">
          Pick a connection
          <IconArrowUpRight />
        </Button>
      </div>
      {children}
    </div>
  );
};
