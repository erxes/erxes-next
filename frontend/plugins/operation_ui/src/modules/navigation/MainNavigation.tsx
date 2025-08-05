import { Button, cn } from 'erxes-ui';
import { Link, useLocation } from 'react-router-dom';
import { IconUserFilled, IconBox } from '@tabler/icons-react';

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
          <IconBox className="text-accent-foreground" />
          Projects
        </Link>
      </Button>
    </div>
  );
};
