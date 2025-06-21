import { getAutomationTypes } from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

export const TriggerNodeConfigurationContent = ({
  type,
  config,
}: {
  type: string;
  config: any;
}) => {
  const [pluginName, moduleName] = getAutomationTypes(type || '');

  return (
    <RenderPluginsComponent
      pluginName={`${pluginName}_ui`}
      remoteModuleName="automations"
      moduleName={moduleName}
      props={{
        componentType: 'triggerConfigContent',
        type,
        config,
      }}
    />
  );
};
