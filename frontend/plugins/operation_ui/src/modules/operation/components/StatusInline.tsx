import { STATUS_TYPE_LABELS } from '@/operation/constants/statusConstants';
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

export const StatusInlineIcon = ({
  statusType = 0,
  style,
  className,
  color,
  ...props
}: React.ComponentProps<Icon> & { statusType?: number | string }) => {
  const numericType =
    (typeof statusType === 'string' ? parseInt(statusType, 10) : statusType) -
    1;
  const StatusIconComponent = [
    IconCircleDashed,
    IconCircle,
    IconCircleDot,
    IconCircleCheck,
    IconCircleX,
  ][numericType];

  const colorClassName = [
    'text-muted-foreground',
    'text-info',
    'text-warning',
    'text-success',
    'text-destructive',
  ][numericType];

  if (!StatusIconComponent) {
    return null;
  }

  return (
    <StatusIconComponent
      {...props}
      color={color ? color : undefined}
      className={cn('size-4 flex-none', colorClassName, className)}
    />
  );
};

StatusInlineIcon.displayName = 'StatusInlineIcon';

export const StatusInlineLabel = ({
  statusType = 0,
}: {
  statusType?: number | string;
}) => {
  const numericType =
    (typeof statusType === 'string' ? parseInt(statusType, 10) : statusType) -
    1;
  return <span className="capitalize">{STATUS_TYPE_LABELS[numericType]}</span>;
};
