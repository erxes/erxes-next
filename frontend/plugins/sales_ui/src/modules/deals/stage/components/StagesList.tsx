import { Skeleton, useQueryState } from 'erxes-ui';

import DraggableGroup from '@/deals/components/common/Droppable';
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
    <DraggableGroup direction="horizontal">
      {(stages || ([] as IStage[])).map((stage) => (
        <InView key={stage._id} triggerOnce rootMargin="200px">
          {({ inView, ref }) => (
            <div ref={ref} className="w-72 shrink-0">
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
  );
};
