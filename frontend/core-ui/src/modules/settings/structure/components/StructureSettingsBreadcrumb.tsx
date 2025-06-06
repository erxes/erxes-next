import { IconChartPie2 } from '@tabler/icons-react';
import { Button, Separator } from 'erxes-ui';
import { useLocation } from 'react-router';
import { SETTINGS_ROUTES } from '../constants/structure-routes';

export function StructureSettingsBreadcrumb() {
  const { pathname } = useLocation();
  return (
    <>
      <Button variant="ghost" className="font-semibold">
        <IconChartPie2 className="w-4 h-4 text-accent-foreground" />
        Structure
      </Button>
      <Separator.Inline />
      <Button variant="ghost" className="hover:bg-transparent font-semibold">
        {SETTINGS_ROUTES[pathname as keyof typeof SETTINGS_ROUTES]}
      </Button>
    </>
  );
}
