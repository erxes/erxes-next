import { IconCaretUpFilled } from '@tabler/icons-react';
import { Collapsible, Sidebar } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { Link, useLocation } from 'react-router-dom';

export const NavigationMenuLinkItem = ({
  name,
  icon: IconComponent,
  path,
  pathPrefix,
  children,
}: {
  pathPrefix?: string;
  path: string;
  name: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
}) => {
  const { pathname } = useLocation();
  const fullPath = pathPrefix ? `${pathPrefix}/${path}` : path;
  const isActive = pathname.startsWith(`/${fullPath}`);
  return (
    <Sidebar.MenuItem>
      <Sidebar.MenuButton asChild isActive={isActive}>
        <Link to={fullPath}>
          {!!IconComponent && (
            <IconComponent
              className={cn(
                'text-accent-foreground',
                isActive && 'text-primary',
              )}
            />
          )}
          <span className="capitalize">{name}</span>
          {children}
        </Link>
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  );
};

export const NavigationMenuItem = ({
  name,
  icon: IconComponent,
}: {
  name: string;
  icon: React.ElementType;
}) => {
  return (
    <Sidebar.MenuItem>
      <Sidebar.MenuButton>
        <IconComponent className="text-accent-foreground" />
        <span className="capitalize">{name}</span>
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  );
};

export const NavigationMenuGroup = ({
  name,
  children,
  separate = true,
  className,
}: {
  name: string;
  children: React.ReactNode;
  separate?: boolean;
  className?: string;
}) => {
  return (
    <>
      {separate && <Sidebar.Separator />}
      <Collapsible defaultOpen className={cn('group/collapsible', className)}>
        <Sidebar.Group>
          <Sidebar.GroupLabel asChild>
            <Collapsible.Trigger className="flex items-center gap-2">
              <IconCaretUpFilled className="size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              <span className="font-sans text-xs font-semibold normal-case">
                {name}
              </span>
            </Collapsible.Trigger>
          </Sidebar.GroupLabel>
          <Collapsible.Content>
            <Sidebar.GroupContent className="pt-2">
              <Sidebar.Menu>{children}</Sidebar.Menu>
            </Sidebar.GroupContent>
          </Collapsible.Content>
        </Sidebar.Group>
      </Collapsible>
    </>
  );
};
