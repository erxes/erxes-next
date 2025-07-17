import { IconInfoTriangle } from '@tabler/icons-react';
import { cn } from 'erxes-ui';

export const BlurWrapper = ({
  isDisabled,
  children,
  className,
}: {
  isDisabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('relative flex-1', className)}>
    {isDisabled && (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm text-muted-foreground gap-2 text-xs">
        <IconInfoTriangle className="w-4 h-4 text-yellow-500" />
        This section is disabled
      </div>
    )}
    <div
      className={cn('h-full', {
        'pointer-events-none opacity-50': isDisabled,
      })}
    >
      {children}
    </div>
  </div>
);
