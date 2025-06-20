import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { SegmentForm } from 'ui-modules';
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

export const TriggerDetail = ({ activeNode }: Props) => {
  return (
    <div className="w-[650px] flex flex-col max-h-full">
      <DefaultTriggerContent activeNode={activeNode} />
    </div>
  );
};
