import { type Icon, IconStar } from '@tabler/icons-react';

import { Separator, Sidebar } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';

export const PluginHeader = ({
  title,
  icon,
  children,
  className,
  separatorClassName,
}: {
  title: string;
  icon: Icon;
  children?: React.ReactNode;
  className?: string;
  separatorClassName?: string;
}) => {
  const Icon = icon;
  return (
    <>
      <header
        className={cn(
          'flex items-center justify-between h-[52px] -mx-3 px-3 box-border flex-shrink-0',
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <Sidebar.Trigger />
          <span className="h-3 w-0.5 bg-muted rounded-sm" />
          <div className="flex items-center gap-2 px-2">
            <Icon className="w-4 h-4" />
            <span className="text-[13px] font-semibold leading-none">
              {title}
            </span>
          </div>
          <span className="h-3 w-0.5 bg-muted rounded-sm" />
          <IconStar className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">{children}</div>
      </header>
      <Separator className={cn('-mx-3 w-auto mb-1.5', separatorClassName)} />
    </>
  );
};
