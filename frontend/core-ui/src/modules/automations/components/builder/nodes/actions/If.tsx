import { getContentType } from '@/automations/utils/automationBuilderUtils';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';
import { useFormContext } from 'react-hook-form';
import { IActionProps, SegmentForm } from 'ui-modules';

export const IF = ({ currentAction, handleSave }: IActionProps) => {
  const { watch } = useFormContext<TAutomationProps>();
  const { actions = [], triggers = [] } = watch('detail');

  const contentType = getContentType(currentAction, actions, triggers);

  return (
    <SegmentForm
      contentType={contentType}
      segmentId={currentAction?.config?.contentId}
      callback={(contentId) => handleSave({ contentId })}
      isTempoaray
    />
  );
};
