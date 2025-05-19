import { IconChartPie2 } from '@tabler/icons-react';
import { Button, Separator } from 'erxes-ui';
import { useLocation } from 'react-router';
import { SETTINGS_ROUTES } from '../constants/structure-routes';
import { useBranchesList } from '../hooks/useBranchesList';
import { BranchesTotalCount } from './branches/BranchesTotalCount';
import { DepartmentsTotalCount } from './departments/DepartmentsTotalCount';
import { UnitsTotalCount } from './units/UnitsTotalCount';
import { PositionsTotalCount } from './positions/PositionsTotalCount';

export function StructureSettingsBreadcrumb() {
  const { pathname } = useLocation();
  const { totalCount: branchescount } = useBranchesList();
  return (
    <>
      <Button variant="ghost" className="font-semibold">
        <IconChartPie2 className="w-4 h-4 text-accent-foreground" />
        Structure
      </Button>
      <Separator.Inline />
      <Button variant="ghost" className="hover:bg-transparent font-semibold">
        {SETTINGS_ROUTES[pathname as keyof typeof SETTINGS_ROUTES]}
        {SETTINGS_ROUTES[pathname as keyof typeof SETTINGS_ROUTES] ===
        'Branches' ? (
          <BranchesTotalCount />
        ) : SETTINGS_ROUTES[pathname as keyof typeof SETTINGS_ROUTES] ===
          'Departments' ? (
          <DepartmentsTotalCount />
        ) : SETTINGS_ROUTES[pathname as keyof typeof SETTINGS_ROUTES] ===
          'Units' ? (
          <UnitsTotalCount />
        ) : SETTINGS_ROUTES[pathname as keyof typeof SETTINGS_ROUTES] ===
          'Positions' ? (
          <PositionsTotalCount />
        ) : (
          ''
        )}
      </Button>
    </>
  );
}
