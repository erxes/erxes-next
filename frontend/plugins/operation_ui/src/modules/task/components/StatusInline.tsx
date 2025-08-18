import {
  type Icon,
  IconCircle,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleDot,
  IconCircleX,
} from '@tabler/icons-react';
import { cn } from 'erxes-ui';
import React from 'react';

export const StatusInlineIcon = React.forwardRef<
  Icon,
  React.ComponentProps<Icon> & { type: string; color?: string }
>(({ type, color, style, className, ...props }, ref) => {
  const TeamStatusIcon = {
    backlog: IconCircleDashed,
    unstarted: IconCircle,
    started: IconCircleDot,
    completed: IconCircleCheck,
    cancelled: IconCircleX,
  }[type];

  if (!TeamStatusIcon) {
    return null;
  }

  return (
    <TeamStatusIcon
      ref={ref}
      {...props}
      style={{ ...style, '--status-color': color } as React.CSSProperties}
      className={cn('text-[var(--status-color)] size-4', className)}
    />
  );
});
