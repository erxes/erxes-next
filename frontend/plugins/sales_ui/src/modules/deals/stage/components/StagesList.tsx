import { Skeleton, useQueryState } from 'erxes-ui';

import DraggableGroup, {
  SortableItem,
} from '@/deals/components/common/Droppable';
import { IStage } from '@/deals/types/stages';
import { InView } from 'react-intersection-observer';
import { Stage } from './Stage';
import { StagesLoading } from '@/deals/components/loading/StagesLoading';
import { useStages } from '@/deals/stage/hooks/useStages';

export const StagesList = () => {
  const [pipelineId] = useQueryState<string>('pipelineId');

  const { stages, loading: stagesLoading } = useStages({
    variables: {
      pipelineId,
    },
  });

  if (stagesLoading) {
    return <StagesLoading />;
  }

  return (
    <div
      className="w-full h-full overflow-x-auto max-w-[var(--max-width)]"
      style={
        {
          '--max-width': `calc(18rem * ${stages?.length})`,
        } as React.CSSProperties
      }
    >
      <DraggableGroup direction="horizontal">
        {(stages || ([] as IStage[])).map((stage, i) => (
          <InView key={stage._id} triggerOnce rootMargin="200px">
            {({ inView, ref }) => (
              <div
                ref={ref}
                className="w-72 flex-none bg-gradient-to-b from-[#e0e7ff] to-[#e0e7ff50] rounded-t-lg  h-full flex flex-col overflow-hidden"
              >
                {inView ? (
                  <Stage stage={stage} />
                ) : (
                  <Skeleton className="w-72 h-full rounded-md" />
                )}
              </div>
            )}
          </InView>
        ))}
      </DraggableGroup>
    </div>
  );
};
