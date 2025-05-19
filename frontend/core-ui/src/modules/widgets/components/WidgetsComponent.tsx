import { WidgetProps } from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const WidgetsComponent = (props: WidgetProps) => {
  const { module } = props;

  return (
    <RenderPluginsComponent
      pluginName={`${module.pluginName}_ui`}
      remoteModuleName="widgets"
      moduleName={module.name}
      props={props}
    />
  );
};
