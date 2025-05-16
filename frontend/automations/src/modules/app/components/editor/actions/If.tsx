import { useQueryState } from 'erxes-ui/hooks';
import { useFormContext } from 'react-hook-form';
import SegmentForm from 'ui-modules/modules/segments/form';
import { TAutomationProps } from '../common/formSchema';
import { IAction, IActionProps, ITrigger } from 'ui-modules';

const getContentType = (
  currentAction: IAction,
  actions: IAction[],
  triggers: ITrigger[],
) => {
  const trigger = triggers.find((t) => t.actionId === currentAction.id);
  if (trigger) {
    return trigger.type;
  }

  // Find the parent action that leads to this current action
  const parentAction = actions.find((a) => a.nextActionId === currentAction.id);
  if (parentAction) {
    // Recursively call the function with the parent action
    return getContentType(parentAction, actions, triggers);
  }

  // Fallback if nothing found in the chain
  return triggers[0]?.type;
};

export const IF = ({ currentAction, handleSave }: IActionProps) => {
  const { watch } = useFormContext<TAutomationProps>();
  const { actions = [], triggers = [] } = watch('detail');

  const contentType = getContentType(currentAction, actions, triggers);

  console.log({ contentType });
  return (
    <SegmentForm
      contentType={contentType}
      segmentId={currentAction?.config?.contentId}
      callback={(contentId) => handleSave({ contentId })}
      isTempoaray
    />
  );
};
