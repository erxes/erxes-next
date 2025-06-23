import { useCustomTriggerContent } from '@/automations/components/builder/sidebar/hooks/useCustomTriggerContent';
import { useDefaultTriggerContent } from '@/automations/components/builder/sidebar/hooks/useDefaultTriggerContent';
import { SegmentForm } from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';
import { NodeData } from '@/automations/types';

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
  const { pluginName, moduleName, onSaveTriggerConfig } =
    useCustomTriggerContent(activeNode);

  return (
    <RenderPluginsComponent
      pluginName={`frontline_ui`}
      remoteModuleName="automations"
      moduleName={'facebook'}
      props={{
        componentType: 'triggerForm',
        activeTrigger: activeNode,
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
