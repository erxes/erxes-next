import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { IconCaretUpFilled } from '@tabler/icons-react';
import { Collapsible, Sidebar, UIConfig } from 'erxes-ui';
import { CORE_MODULES } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { MainNavigationButton } from './MainNavigationBar';
import { Icon } from '@tabler/icons-react';

export function SidebarNavigation() {
  const { t } = useTranslation();
  const [pluginsMetaData] = useAtom(pluginsConfigState);

  const modules = useMemo(() => {
    const coreModules = [
      ...CORE_MODULES.filter((module) => module.hasSettings),
    ];

    if (pluginsMetaData) {
      const settingsModules = Object.values(pluginsMetaData || {}).flatMap(
        (plugin) =>
          plugin.modules.map((module) => ({
            ...module,
            pluginName: plugin.name,
          })),
      );

      return [...coreModules, ...settingsModules] as UIConfig['modules'];
    }
    return coreModules;
  }, [pluginsMetaData]);

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <Sidebar.Group>
        <Sidebar.GroupLabel asChild>
          <Collapsible.Trigger>
            {t('nav.' + 'plugins')}{' '}
            <IconCaretUpFilled className="size-3.5 ml-1 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </Collapsible.Trigger>
        </Sidebar.GroupLabel>
        <Collapsible.Content>
          <Sidebar.GroupContent className="pt-2">
            <Sidebar.Menu>
              {modules.map((item) => {
                return <SidebarNavigationItem key={item.name} {...item} />;
              })}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Collapsible.Content>
      </Sidebar.Group>
    </Collapsible>
  );
}

export function SidebarNavigationItem({
  name,
  icon,
  path,
  submenus,
}: UIConfig['modules'][number]) {
  const { t } = useTranslation();
  const pathname = useLocation().pathname;
  const Icon = icon;
  const pathWithoutUi = path.replace('_ui', '');
  const isActive = pathname.includes(pathWithoutUi);

  return (
    <Collapsible asChild open={isActive} className="group/collapsible">
      <Sidebar.MenuItem key={name}>
        <MainNavigationButton
          pathname={pathWithoutUi}
          name={t('nav.' + name)}
          icon={Icon as Icon}
        />
        {submenus && submenus.length > 0 && (
          <Collapsible.Content asChild>
            <Sidebar.Sub>
              {submenus.map((submenu) => {
                return (
                  <Sidebar.SubItem key={submenu.name}>
                    <Sidebar.SubButton
                      asChild
                      isActive={pathname.includes(submenu.path)}
                      className="w-full"
                    >
                      <Link to={submenu.path}>
                        <span>{t('nav.contactsSub.' + submenu.name)}</span>
                      </Link>
                    </Sidebar.SubButton>
                  </Sidebar.SubItem>
                );
              })}
            </Sidebar.Sub>
          </Collapsible.Content>
        )}
      </Sidebar.MenuItem>
    </Collapsible>
  );
}
