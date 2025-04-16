import { SideMenu, Separator } from 'erxes-ui';
import { useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { pluginsConfigState } from 'ui-modules';
import { WidgetsComponent } from './WidgetsComponent';

export const WidgetsSidebar = ({ ...props }) => {
  const { pathname } = useLocation();
  const [pluginsMetaData] = useAtom(pluginsConfigState);

  if (!pathname?.includes('detail') && !pathname?.includes('/inbox')) {
    return null;
  }

  const plugins = Object.values(pluginsMetaData || {});

  const eligibleWidgets = plugins.filter(
    (plugin) =>
      plugin.haveWidgets && !pathname?.includes(plugin.name.toLowerCase()),
  );

  if (eligibleWidgets.length === 0) {
    return null;
  }

  return (
    <SideMenu className="flex-none">
      {eligibleWidgets.map((widget) => (
        <SideMenu.Content value={widget.name} key={`content-${widget.name}`}>
          <WidgetsComponent pluginName={widget.name} {...props} />
        </SideMenu.Content>
      ))}

      <SideMenu.Sidebar className="">
        {eligibleWidgets.map((widget) => (
          <>
            <SideMenu.Trigger
              key={`trigger-${widget.name}`}
              Icon={widget.widgetsIcon}
              label={widget.name}
              value={widget.name}
            />
          </>
        ))}
        <Separator.Inline orientation="horizontal" />
      </SideMenu.Sidebar>
    </SideMenu>
  );
};
