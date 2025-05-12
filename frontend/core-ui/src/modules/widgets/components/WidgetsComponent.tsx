import { WidgetProps } from 'ui-modules';
import { RenderPLuginsComponent } from '~/plugins/components/RenderPLuginsComponent';

export const WidgetsComponent = (props: WidgetProps) => {
  const { module } = props;

  return (
    <RenderPLuginsComponent
      pluginName={`${module.pluginName}_ui`}
      remoteModuleName="widgets"
      moduleName={module.name}
      props={props}
    />
  );
};
