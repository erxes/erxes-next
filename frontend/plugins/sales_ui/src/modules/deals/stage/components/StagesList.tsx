import BoardView from '@/deals/components/common/kanban/BoardView';
import { IDeal } from '@/deals/types/deals';
import { IStage } from '@/deals/types/stages';
// import DraggableGroup from '@/deals/components/common/Droppable';
// import { IStage } from '@/deals/types/stages';
// import { Stage } from './Stage';
import { StagesLoading } from '@/deals/components/loading/StagesLoading';
import { useDeals } from '@/deals/cards/hooks/useDeals';
import { useQueryState } from 'erxes-ui';
import { useStages } from '@/deals/stage/hooks/useStages';

export const StagesList = () => {
  const [pipelineId] = useQueryState<string>('pipelineId');

  const { stages, loading: stagesLoading } = useStages({
    variables: {
      pipelineId,
    },
  });

  const { deals, loading: dealsLoading } = useDeals({
    variables: {
      pipelineId,
      limit: 100,
    },
  });

  if (stagesLoading) {
    return <StagesLoading />;
  }

  return (
    <BoardView
      stages={stages || ([] as IStage[])}
      deals={deals?.list || ([] as IDeal[])}
      dealsLoading={dealsLoading}
    />
  );

  // return (
  //   <DraggableGroup direction="horizontal">
  //     {(stages || ([] as IStage[])).map((stage) => (
  //       <Stage key={stage._id} stage={stage} />
  //     ))}
  //   </DraggableGroup>
  // );
};
