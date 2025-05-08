import { Icon, IconCaretDownFilled } from '@tabler/icons-react';
import { cn, Sidebar } from 'erxes-ui';
import { Link, useLocation } from 'react-router';

export const NavigationButton = ({
  pathPrefix,
  pathname,
  name,
  icon,
}: {
  pathPrefix?: string;
  pathname: string;
  name: string;
  icon: Icon;
}) => {
  const Icon = icon;
  const activePathname = useLocation().pathname;
  const pathnameWithSlash = '/' + pathname;

  const pathnameWithPrefix = pathPrefix
    ? '/' + pathPrefix + pathnameWithSlash
    : pathnameWithSlash;

  console.log(pathnameWithPrefix, activePathname);

  const isActive = activePathname === pathnameWithPrefix;

  const isSubItemActive =
    !isActive && activePathname.includes(pathnameWithPrefix);

  return (
    <Sidebar.MenuButton
      asChild
      isActive={isActive}
      className={cn(isSubItemActive && 'bg-muted')}
    >
      <Link to={pathnameWithPrefix}>
        {isSubItemActive ? (
          <IconCaretDownFilled className="text-accent-foreground" />
        ) : (
          <Icon
            className={cn('text-accent-foreground', isActive && 'text-primary')}
          />
        )}
        <span className="capitalize">{name}</span>
      </Link>
    </Sidebar.MenuButton>
  );
};
