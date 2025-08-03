import {
  KanbanBoard,
  KanbanCard,
  KanbanProvider,
} from '@/deals/components/common/kanban/KanbanContext';
import { useEffect, useState } from 'react';

import { KanbanCards } from '@/deals/components/common/kanban/KanbanCards';
import { StageHeader } from './StageHeader';
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

  const [features, setFeatures] = useState([]);
  const [columns, setColumns] = useState(stages || []);

  useEffect(() => {
    setColumns(stages || []);
  }, [stages, pipelineId]);

  if (stagesLoading) {
    return <StagesLoading />;
  }

  return (
    <div className="w-full h-full overflow-x-auto">
      <KanbanProvider
        columns={columns}
        data={features}
        onDataChange={setFeatures}
        onColumnsChange={setColumns}
      >
        {(column) => (
          <KanbanBoard _id={column._id} key={column._id}>
            <StageHeader stage={column} />
            <KanbanCards id={column._id}>
              {(feature) => (
                <KanbanCard
                  key={feature._id}
                  card={feature}
                  featureId={feature._id}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="m-0 flex-1 font-medium text-sm">
                        {feature.name}
                      </p>
                    </div>
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
};
