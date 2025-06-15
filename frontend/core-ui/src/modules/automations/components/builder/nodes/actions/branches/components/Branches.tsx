import { IActionProps, SegmentForm } from 'ui-modules';
import { useBranches } from '../hooks/useBranches';

export const Branches = ({ currentAction, handleSave }: IActionProps) => {
  const { contentType } = useBranches(currentAction);

  return (
    <div className="w-[650px] flex flex-col max-h-full">
      <SegmentForm
        contentType={contentType}
        segmentId={currentAction?.config?.contentId}
        callback={(contentId) => handleSave({ contentId })}
        isTemporary
      />
    </div>
  );
};
