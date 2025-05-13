import { useLocation } from 'react-router';
import { SETTINGS_ROUTES } from '../constants/structure-routes';

export function StructureTopbar() {
  const { pathname } = useLocation();
  if (pathname.includes(SETTINGS_ROUTES['/settings/structure'])) {
    return (
      <div className="ml-auto flex items-center gap-3">
        filter
        add
      </div>
    );
  }
  return null;
}
