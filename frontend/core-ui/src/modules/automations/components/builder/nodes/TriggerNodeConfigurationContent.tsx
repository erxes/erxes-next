import {
  TAutomationTriggerComponent,
  getCoreAutomationTriggerComponent,
  isCoreAutomationTriggerType,
} from '@/automations/components/builder/nodes/triggers/coreAutomationTriggers';
import { RenderPluginsComponentWrapper } from '@/automations/components/common/RenderPluginsComponentWrapper';
import { splitAutomationNodeType } from 'ui-modules';

export const TriggerNodeConfigurationContent = ({
  type,
  config,
}: {
  type: string;
  config: any;
}) => {
  const [pluginName, moduleName] = splitAutomationNodeType(type || '');

  if (
    isCoreAutomationTriggerType(
      moduleName as any,
      TAutomationTriggerComponent.NodeContent,
    )
  ) {
    const CoreActionComponent = getCoreAutomationTriggerComponent(
      moduleName as any,
      TAutomationTriggerComponent.NodeContent,
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
