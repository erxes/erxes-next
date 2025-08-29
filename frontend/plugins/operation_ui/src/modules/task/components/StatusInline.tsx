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
import { TeamStatusTypes } from '@/team/constants';

export const StatusInlineIcon = React.forwardRef<
  Icon,
  React.ComponentProps<Icon> & { type: number; color?: string }
>(({ type, color, style, className, ...props }) => {
  const TeamStatusIcon = {
    [TeamStatusTypes.Backlog]: IconCircleDashed,
    [TeamStatusTypes.Unstarted]: IconCircle,
    [TeamStatusTypes.Started]: IconCircleDot,
    [TeamStatusTypes.Completed]: IconCircleCheck,
    [TeamStatusTypes.Cancelled]: IconCircleX,
  }[type] as React.ComponentType<React.ComponentProps<Icon>>;

  if (!TeamStatusIcon) {
    return null;
  }

  return (
    <TeamStatusIcon
      {...props}
      style={{ ...style, '--status-color': color } as React.CSSProperties}
      className={cn('text-[var(--status-color)] size-4', className)}
    />
  );
});
