import { Button, cn, Collapsible, Sidebar } from 'erxes-ui';
import { Link, useLocation } from 'react-router-dom';
import { IconUserFilled, IconCaretUpFilled } from '@tabler/icons-react';

export const MainNavigation = () => {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="p-3 flex flex-col gap-1 h-full">
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start flex-none',
          isActive('/operation/my-tasks') && 'bg-muted',
        )}
        asChild
      >
        <Link to="/operation/my-tasks">
          <IconUserFilled className="text-accent-foreground" />
          My tasks
        </Link>
      </Button>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start flex-none',
          isActive('/operation/projects') && 'bg-muted',
        )}
        asChild
      >
        <Link to="/operation/projects">
          <IconUserFilled className="text-accent-foreground" />
          Projects
        </Link>
      </Button>
      <Collapsible defaultOpen className="group/collapsible">
        <Sidebar.GroupLabel asChild>
          <Collapsible.Trigger className="flex items-center gap-2">
            <IconCaretUpFilled className="size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            <span className="font-sans text-xs font-semibold normal-case">
              Teams
            </span>
          </Collapsible.Trigger>
        </Sidebar.GroupLabel>
        <Collapsible.Content>
          <Sidebar.GroupContent className="pt-2">
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start flex-none',
                    isActive('/operation/my-tasks') && 'bg-muted',
                  )}
                  asChild
                >
                  <Link to="/operation/my-tasks">
                    <IconUserFilled className="text-accent-foreground" />
                    My tasks
                  </Link>
                </Button>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
};
