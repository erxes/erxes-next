import {
  Sortable,
  Props as SortableProps,
} from '@/deals/components/common/Sortable';
import { Spinner, useQueryState } from 'erxes-ui';

import PipelineStageItem from './PipleineStageItem';
import { useStages } from '@/deals/stage/hooks/useStages';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

const props: Partial<SortableProps> = {
  strategy: verticalListSortingStrategy,
  itemCount: 10,
};

const PipelineStages = () => {
  const [pipelineId] = useQueryState('pipelineId');

  const { stages, loading: stagesLoading } = useStages({
    variables: {
      pipelineId,
    },
  });

  if (stagesLoading) {
    return <Spinner />;
  }

  const items = (stages || []).map((stage) => stage._id);

  return (
    <div>
      PipelineStages
      <Sortable
        {...props}
        items={items || []}
        renderItem={(props: any) => {
          return <PipelineStageItem {...props} stages={stages} />;
        }}
      />
    </div>
  );
};

export default PipelineStages;
