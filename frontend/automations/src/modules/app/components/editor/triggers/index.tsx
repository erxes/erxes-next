import { useFormContext } from 'react-hook-form';
import SegmentForm from 'ui-modules/modules/segments/form';
import { TAutomationProps } from '../common/formSchema';
import { NodeData } from '~/modules/app/types';

type Props = { activeNode: NodeData };

const DefaultTriggerContent = ({ activeNode }: Props) => {
  const { watch, setValue } = useFormContext<TAutomationProps>();
  const triggers = watch(`detail.triggers`);
  const currentIndex = triggers.findIndex(
    (trigger) => trigger.id === activeNode.id,
  );
  const contentId = watch(`detail.triggers.${currentIndex}`)?.config?.contentId;
  console.log({ contentId, shdiasd: 'dasd' });
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
      isTempoaray
    />
  );
};

export const TriggerDetail = ({ activeNode }: Props) => {
  return <DefaultTriggerContent activeNode={activeNode} />;
};
