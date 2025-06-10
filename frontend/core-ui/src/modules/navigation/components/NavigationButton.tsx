import { SettingsPath } from '@/types/paths/SettingsPath';
import { Icon, IconCaretDownFilled } from '@tabler/icons-react';
import { cn, Sidebar } from 'erxes-ui';
import { Link, useLocation } from 'react-router';

interface NavigationButtonProps {
  pathPrefix?: string;
  pathname: string;
  name: string;
  icon: Icon;
  isFavorite?: boolean;
}

export const NavigationButton = ({
  pathPrefix,
  pathname,
  name,
  icon: IconComponent,
  isFavorite,
}: NavigationButtonProps) => {
  const { pathname: activePathname } = useLocation();
  const pathnameWithSlash = `/${pathname}`;
  const pathnameWithPrefix = pathPrefix
    ? `/${pathPrefix}${pathnameWithSlash}`
    : pathnameWithSlash;

  const isActive = activePathname === pathnameWithPrefix;
  const isSubItemActive =
    !isFavorite && !isActive && activePathname.includes(pathnameWithPrefix);
  const isSettingsIndexActive = activePathname.includes(SettingsPath.Index);
  const shouldShowCaret = isSubItemActive && !isSettingsIndexActive;
  const isIconActive = isActive || (isSubItemActive && isSettingsIndexActive);

  return (
    <Sidebar.MenuButton
      asChild
      isActive={isIconActive}
      className={cn(isSubItemActive && 'bg-muted')}
    >
      <Link to={pathnameWithPrefix}>
        {shouldShowCaret ? (
          <IconCaretDownFilled className="text-accent-foreground" />
        ) : (
          <IconComponent
            className={cn(
              'text-accent-foreground',
              isIconActive && 'text-primary',
            )}
          />
        )}
        <span className="capitalize">{name}</span>
      </Link>
    </Sidebar.MenuButton>
  );
};
