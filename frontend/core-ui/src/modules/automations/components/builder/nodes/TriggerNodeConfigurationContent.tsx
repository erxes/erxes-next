import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const TriggerNodeConfigurationContent = ({
  type,
  config,
}: {
  type: string;
  config: any;
}) => {
  return (
    <RenderPluginsComponent
      pluginName={`frontline_ui`}
      remoteModuleName="automations"
      moduleName={'facebook'}
      props={{
        componentType: 'triggerConfigContent',
        type,
        config,
      }}
    />
  );
};
