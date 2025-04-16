import { useLocation } from 'react-router';
import { Button, Separator } from 'erxes-ui';
import { IconMailFilled } from '@tabler/icons-react';
import { SETTINGS_ROUTES } from '../constants/settingsRoutes';
import { IntegrationTotalCountByKind } from './IntegrationTotalCountByKind';

export const InboxSettingsBreadcrumb = () => {
  const { pathname } = useLocation();
  return (
    <>
      <Button variant={'ghost'} className="font-semibold">
        <IconMailFilled className="w-4 h-4 text-accent-foreground" />
        Team inbox
      </Button>
      <Separator.Inline />
      <Button variant="ghost" className="hover:bg-transparent font-semibold">
        {SETTINGS_ROUTES[pathname as keyof typeof SETTINGS_ROUTES]}
        {pathname === '/settings/inbox' && <IntegrationTotalCountByKind />}
      </Button>
    </>
  );
};
