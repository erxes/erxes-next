import BoardView from '@/deals/components/common/kanban/BoardView';
import { IDeal } from '@/deals/types/deals';
import { IStage } from '@/deals/types/stages';
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
};
