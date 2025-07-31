import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from './components/common/kanban/KanbanContext';
import { Spinner, useQueryState } from 'erxes-ui';
import { useEffect, useState } from 'react';

import { useDeals } from '@/deals/cards/hooks/useDeals';
import { useInView } from 'react-intersection-observer';
import { useStages } from '@/deals/stage/hooks/useStages';

const DealsSettings = () => {
  const [pipelineId] = useQueryState<string>('pipelineId');

  const { ref: triggerRef, inView: isTriggerInView } = useInView({
    triggerOnce: true,
  });

  const { ref: loadMoreRef, inView: isLoadMoreVisible } = useInView({
    rootMargin: '200px',
    threshold: 0,
  });

  const { stages, loading: stagesLoading } = useStages({
    variables: {
      pipelineId,
    },
  });

  const {
    list,
    loading: dealsLoading,
    handleFetchMore,
    hasNextPage,
  } = useDeals({
    variables: {
      pipelineId,
    },
    // skip: !isTriggerInView,
    fetchPolicy: 'cache-and-network',
  });

  const [features, setFeatures] = useState(list || []);
  const [columns, setColumns] = useState(stages || []);

  useEffect(() => {
    setFeatures(list || []);
  }, [list]);

  useEffect(() => {
    setColumns(stages || []);
  }, [stages]);

  if (stagesLoading || dealsLoading) {
    return <Spinner />;
  }

  return (
    <KanbanProvider
      columns={columns}
      data={features}
      onDataChange={setFeatures}
      onColumnsChange={setColumns}
    >
      {(column) => (
        <KanbanBoard _id={column._id} key={column._id}>
          <KanbanHeader>
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                // style={{ backgroundColor: column.color }}
              />
              <span>{column.name}</span>
            </div>
          </KanbanHeader>
          <KanbanCards id={column._id} loading={false}>
            {(feature: (typeof features)[number]) => (
              <KanbanCard
                columnId={column._id}
                featureId={feature._id}
                key={feature._id}
                name={feature.name}
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
  );
};

export default DealsSettings;
