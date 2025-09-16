import {
  CoreComponentType,
  getCoreAutomationTriggerComponent,
  isCoreAutomationTriggerType,
} from '@/automations/components/builder/nodes/triggers/coreAutomationTriggers';
import { RenderPluginsComponentWrapper } from '@/automations/components/common/RenderPluginsComponentWrapper';
import { getAutomationTypes } from 'ui-modules';

export const TriggerNodeConfigurationContent = ({
  type,
  config,
}: {
  type: string;
  config: any;
}) => {
  const [pluginName, moduleName] = getAutomationTypes(type || '');

  if (
    isCoreAutomationTriggerType(
      moduleName as any,
      CoreComponentType.NodeContent,
    )
  ) {
    const CoreActionComponent = getCoreAutomationTriggerComponent(
      moduleName as any,
      CoreComponentType.NodeContent,
    );
    return (
      <div className="px-4 py-2">
        {CoreActionComponent ? <CoreActionComponent config={config} /> : <></>}
      </div>
    );
  }

  return (
    <RenderPluginsComponentWrapper
      pluginName={pluginName}
      moduleName={moduleName}
      props={{
        componentType: 'triggerConfigContent',
        type,
        config,
      }}
    />
  );
};
