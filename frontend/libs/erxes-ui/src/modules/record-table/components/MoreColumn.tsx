import React from 'react';

import { IconDots } from '@tabler/icons-react';

import { Button, ButtonProps } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';

export const RecordTableMoreButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 w-full focus-visible:outline-transparent rounded-none focus-visible:shadow-subtle',
        className,
      )}
      {...props}
    >
      <IconDots className="text-muted-foreground" />
    </Button>
  );
});
