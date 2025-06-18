import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { toast, useQueryState } from 'erxes-ui';
import { useFormContext } from 'react-hook-form';
import { SegmentForm } from 'ui-modules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';
import { NodeData } from '../../../../types';

type Props = { activeNode: NodeData };

const DefaultTriggerContent = ({ activeNode }: Props) => {
  const { watch, setValue } = useFormContext<TAutomationProps>();
  const triggers = watch(`detail.triggers`);
  const currentIndex = triggers.findIndex(
    (trigger) => trigger.id === activeNode.id,
  );
  const contentId = watch(`detail.triggers.${currentIndex}`)?.config?.contentId;
  const handleCallback = (contentId: string) => {
    const triggers = watch('detail.triggers');
    const updatedTriggers = triggers.map((trigger) =>
      trigger.id === activeNode.id
        ? { ...trigger, config: { ...(trigger?.config || {}), contentId } }
        : trigger,
    );
    setValue('detail.triggers', updatedTriggers);
  };
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
  const { watch, setValue } = useFormContext<TAutomationProps>();
  const [_, setActiveNodeId] = useQueryState('activeNodeId');

  const onSaveTriggerConfig = (config: any) => {
    const triggers = watch(`detail.triggers`);
    const currentIndex = triggers.findIndex(
      (trigger) => trigger.id === activeNode.id,
    );

    setValue(`detail.triggers.${currentIndex}.config`, config);
    setActiveNodeId(null);
    toast({
      title: 'Trigger configuration added successfully.',
    });
  };

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
