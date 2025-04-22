import { SideMenu, Separator } from 'erxes-ui';
import { useAtom } from 'jotai';
import { pluginsConfigState, WidgetProps } from 'ui-modules';
import { RenderPLuginsComponent } from '~/plugins/components/RenderPLuginsComponent';

export const WidgetsSidebar = (props: WidgetProps) => {
  const [pluginsMetaData] = useAtom(pluginsConfigState);

  const plugins = Object.values(pluginsMetaData || {});

  const eligibleWidgets = plugins.filter(
    (plugin) => plugin.haveWidgets && plugin.name !== props.pluginName,
  );

  if (eligibleWidgets.length === 0) {
    return null;
  }

  return (
    <SideMenu className="flex-none">
      {eligibleWidgets.map((widget) => (
        <SideMenu.Content value={widget.name} key={`content-${widget.name}`}>
          <RenderPLuginsComponent
            pluginName={`${widget.name}_ui`}
            componentType="Widgets"
          />
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
