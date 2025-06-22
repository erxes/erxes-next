import { RelationWidgetProps } from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const WidgetsComponent = (props: RelationWidgetProps) => {
  const { module } = props;

  return (
    <RenderPluginsComponent
      pluginName={`${module.pluginName}_ui`}
      remoteModuleName="relationWidget"
      moduleName={module.name}
      props={props}
    />
  );
};
