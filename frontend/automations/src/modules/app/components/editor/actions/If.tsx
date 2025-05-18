import { useQueryState } from 'erxes-ui/hooks';
import { useFormContext } from 'react-hook-form';
import SegmentForm from 'ui-modules/modules/segments/form';
import { TAutomationProps } from '../common/formSchema';
import { IAction, IActionProps, ITrigger } from 'ui-modules';
import { getContentType } from '../common/utils';

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
