import { IActionProps, SegmentForm } from 'ui-modules';
import { useIf } from '../hooks/useIf';

export const IF = ({ currentAction, handleSave }: IActionProps) => {
  const { contentType } = useIf(currentAction);

  return (
    <div className="w-[650px] flex flex-col max-h-full">
      <SegmentForm
        contentType={contentType}
        segmentId={currentAction?.config?.contentId}
        callback={(contentId) => handleSave({ contentId })}
        isTempoaray
      />
    </div>
  );
};
