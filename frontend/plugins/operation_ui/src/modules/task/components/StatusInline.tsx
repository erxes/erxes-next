import {
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
  SVGSVGElement,
  React.ComponentProps<'svg'> & { type: any; color?: string }
>(({ type, color, style, className, ...props }) => {
  const TeamStatusIconMap: Record<number, React.ComponentType<any>> = {
    [TeamStatusTypes.Backlog]: IconCircleDashed,
    [TeamStatusTypes.Unstarted]: IconCircle,
    [TeamStatusTypes.Started]: IconCircleDot,
    [TeamStatusTypes.Completed]: IconCircleCheck,
    [TeamStatusTypes.Cancelled]: IconCircleX,
  };

  const numericType = typeof type === 'string' ? parseInt(type, 10) : type;
  const TeamStatusIcon = TeamStatusIconMap[numericType];

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

StatusInlineIcon.displayName = 'StatusInlineIcon';
