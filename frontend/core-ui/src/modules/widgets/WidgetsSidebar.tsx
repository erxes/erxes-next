import { Icon } from '@tabler/icons-react';
import { SideMenu, Separator } from 'erxes-ui';
import { useAtom } from 'jotai';
import { pluginsConfigState, WidgetProps } from 'ui-modules';
import { RenderPLuginsComponent } from '~/plugins/components/RenderPLuginsComponent';

export const WidgetsSidebar = (props: WidgetProps) => {
  const [pluginsMetaData] = useAtom(pluginsConfigState);

  const plugins = Object.values(pluginsMetaData || {});

  const widgetsModules = plugins.flatMap((plugin) =>
    plugin.modules
      .filter((module) => module.haveWidgets)
      .map((module) => ({
        ...module,
        pluginName: plugin.name,
      })),
  );

  if (widgetsModules.length === 0) {
    return null;
  }

  return (
    <SideMenu className="flex-none">
      {widgetsModules.map((module) => (
        <SideMenu.Content value={module.name} key={`content-${module.name}`}>
          <RenderPLuginsComponent
            pluginName={`${module.pluginName}_ui`}
            moduleName="Widgets"
            props={props}
          />
        </SideMenu.Content>
      ))}

      <SideMenu.Sidebar className="">
        {widgetsModules.map((module) => (
          <>
            <SideMenu.Trigger
              key={`trigger-${module.name}`}
              Icon={module.icon as Icon}
              label={module.name}
              value={module.name}
            />
          </>
        ))}
        <Separator.Inline orientation="horizontal" />
      </SideMenu.Sidebar>
    </SideMenu>
  );
};
