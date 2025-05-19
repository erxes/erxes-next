import { useLocation } from 'react-router';
import { SETTINGS_ROUTES } from '../constants/structure-routes';
import { BranchesTopbar } from './branches/BranchesTopbar';

export function StructureTopbar() {
  const { pathname } = useLocation();
  if (pathname === '/settings/structure') {
    return null;
  }
  return (
    SETTINGS_ROUTES[pathname as keyof typeof SETTINGS_ROUTES] ===
      'Branches' && <BranchesTopbar />
  );
}
