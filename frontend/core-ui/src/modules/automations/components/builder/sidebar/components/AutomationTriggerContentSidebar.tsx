import { useCustomTriggerContent } from '@/automations/components/builder/sidebar/hooks/useCustomTriggerContent';
import { useDefaultTriggerContent } from '@/automations/components/builder/sidebar/hooks/useDefaultTriggerContent';
import { NodeData } from '@/automations/types';
import { RenderPluginsComponentWrapper } from '@/automations/utils/RenderPluginsComponentWrapper';
import { SegmentForm } from 'ui-modules';

type Props = { activeNode: NodeData };

const DefaultTriggerContent = ({ activeNode }: Props) => {
  const { contentId, handleCallback } = useDefaultTriggerContent({
    activeNode,
  });
  return (
    <SegmentForm
      contentType={activeNode?.type || ''}
      segmentId={contentId}
      callback={handleCallback}
      isTemporary
    />
  );
};

const CustomTriggerContent = ({ activeNode }: Props) => {
  const { pluginName, moduleName, activeTrigger, onSaveTriggerConfig } =
    useCustomTriggerContent(activeNode);

  return (
    <RenderPluginsComponentWrapper
      pluginName={pluginName}
      moduleName={moduleName}
      props={{
        componentType: 'triggerForm',
        activeTrigger,
        onSaveTriggerConfig,
      }}
    />
  );
};

export const AutomationTriggerContentSidebar = ({ activeNode }: Props) => {
  if (activeNode?.isCustom) {
    return <CustomTriggerContent activeNode={activeNode} />;
  }

  return (
    <div className="w-[650px] flex flex-col max-h-full">
      <DefaultTriggerContent activeNode={activeNode} />
    </div>
  );
};
