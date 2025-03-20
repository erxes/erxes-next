import { Link, useLocation } from 'react-router';

import { Breadcrumb } from 'erxes-ui';
import { IconMinusVertical, IconSettings } from '@tabler/icons-react';
import { SETTINGS_PATH_DATA } from '../constants/data';

export function SettingsBreadcrumbs() {
  const { pathname } = useLocation();
  const currentPath =
    SETTINGS_PATH_DATA.nav.find((nav) => pathname.includes(nav.path)) ||
    SETTINGS_PATH_DATA.account.find((acc) => pathname.includes(acc.path));
  return (
    <div className="flex items-center justify-between">
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild className="flex items-center gap-1">
              <Link className="text-black font-semibold" to={`/settings`}>
                <IconSettings size={16} className="stroke-black" />
                Settings
              </Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <IconMinusVertical size={14} className="stroke-black" />
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild className="flex items-center gap-1">
              <Link className="text-black font-semibold" to={pathname}>
                {currentPath?.name}
              </Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
    </div>
  );
}
