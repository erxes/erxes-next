import { Icon } from '@tabler/icons-react';
import { Sidebar } from 'erxes-ui/components';
import { Tabs } from 'erxes-ui/components/tabs';
import { Tooltip } from 'erxes-ui/components/tooltip';
import { cn } from 'erxes-ui/lib/utils';

import { forwardRef } from 'react';

export const SideMenuRoot = forwardRef<
  React.ElementRef<typeof Tabs>,
  React.ComponentProps<typeof Tabs>
>(({ className, ...props }, ref) => {
  return (
    <Tabs
      ref={ref}
      className={cn('flex', className)}
      orientation="horizontal"
      {...props}
    >
      {props.children}
    </Tabs>
  );
});
SideMenuRoot.displayName = 'SideMenuRoot';

export const SideMenuContent = forwardRef<
  React.ElementRef<typeof Tabs.Content>,
  React.ComponentProps<typeof Tabs.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <Tabs.Content
      ref={ref}
      className={cn(
        'data-[state=active]:border-l data-[state=active]:min-w-80 transition-all',
        className,
      )}
      {...props}
    >
      {children}
    </Tabs.Content>
  );
});
SideMenuContent.displayName = 'SideMenuContent';

export const SideMenuContentHeader = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentProps<'div'> & {
    Icon?: Icon;
    label?: string;
  }
>(({ className, Icon, label, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('h-12 px-5 flex items-center gap-2', className)}
      {...props}
    >
      {!!Icon && (
        <Icon className="size-4 flex-none text-primary" strokeWidth={3} />
      )}
      <div className="mr-auto font-medium    text-primary">{label}</div>
      {children}
    </div>
  );
});
SideMenuContentHeader.displayName = 'SideMenuContentHeader';

export const SideMenuSidebar = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Tabs.List>
>(({ className, ...props }, ref) => {
  return (
    <Tabs.List
      ref={ref}
      className={cn(
        'w-16 border-l bg-sidebar h-full py-4 flex flex-col items-center justify-start gap-3',
        className,
      )}
      {...props}
    >
      {props.children}
    </Tabs.List>
  );
});
SideMenuSidebar.displayName = 'SideMenuSidebar';

export const SideMenuTrigger = forwardRef<
  React.ElementRef<typeof Tabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof Tabs.Trigger> & {
    label?: string;
    Icon?: Icon;
  }
>(({ className, Icon, label, onClick, ...props }, ref) => {
  const { setOpen } = Sidebar.useSidebar();
  return (
    <Tooltip.Provider>
      <Tooltip>
        <Tabs.Trigger
          ref={ref}
          className={cn(
            'size-10 bg-sidebar data-[state=active]:bg-primary/10 data-[state=active]:text-foreground data-[state=active]:shadow-none [&_svg]:size-5 data-[state=active]:after:hidden [&_svg]:text-primary hover:bg-primary/10 rounded',
            className,
          )}
          onClick={(e) => {
            setOpen(false);
            onClick?.(e);
          }}
          {...props}
          asChild
        >
          <Tooltip.Trigger>
            {!!Icon && <Icon className="size-5 flex-none" />}
          </Tooltip.Trigger>
        </Tabs.Trigger>

        <Tooltip.Content side="left">{label}</Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  );
});

export const SideMenu = Object.assign(SideMenuRoot, {
  Sidebar: SideMenuSidebar,
  Content: SideMenuContent,
  Header: SideMenuContentHeader,
  Trigger: SideMenuTrigger,
});
