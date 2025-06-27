import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext, useWatch } from 'react-hook-form';
import { NodeData } from '@/automations/types';

export const useDefaultTriggerContent = ({
  activeNode,
}: {
  activeNode: NodeData;
}) => {
  const { control, getValues, setValue } = useFormContext<TAutomationProps>();
  const contentId = useWatch({
    control,
    name: `detail.triggers.${activeNode.nodeIndex}`,
  })?.config?.contentId;

  const handleCallback = (contentId: string) => {
    const triggers = getValues('detail.triggers');
    const updatedTriggers = triggers.map((trigger) =>
      trigger.id === activeNode.id
        ? { ...trigger, config: { ...(trigger?.config || {}), contentId } }
        : trigger,
    );
    setValue('detail.triggers', updatedTriggers);
  };
  return {
    contentId,
    handleCallback,
  };
};
