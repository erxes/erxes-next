import DraggableGroup from '@/deals/components/common/Droppable';
import { IStage } from '@/deals/types/stages';
import { Stage } from './Stage';
import { StagesLoading } from '@/deals/components/loading/StagesLoading';
import { useQueryState } from 'erxes-ui';
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
        <Stage key={stage._id} stage={stage} />
      ))}
    </DraggableGroup>
  );
};
