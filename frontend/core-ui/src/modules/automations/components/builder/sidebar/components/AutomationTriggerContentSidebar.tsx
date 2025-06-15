import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { pluginsConfigState, SegmentForm, useWidget } from 'ui-modules';
import { NodeData } from '../../../../types';
import { useAtom } from 'jotai';
import { useWidgetsModules } from '@/widgets/hooks/useWidgetsModules';
import { RenderPluginsComponent } from '~/plugins/components/RenderPluginsComponent';

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
  return (
    <RenderPluginsComponent
      pluginName={`frontline_ui`}
      remoteModuleName="automations"
      moduleName={'facebook'}
      props={{ componentType: 'triggerForm', activeTrigger: activeNode }}
    />
  );
};

export const AutomationTriggerContentSidebar = ({ activeNode }: Props) => {
  console.log({ activeNode });

  if (activeNode?.isCustom) {
    return <CustomTriggerContent activeNode={activeNode} />;
  }

  return (
    <div className="w-[650px] flex flex-col max-h-full">
      <DefaultTriggerContent activeNode={activeNode} />
    </div>
  );
};
