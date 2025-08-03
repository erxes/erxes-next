import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/deals/components/common/kanban/KanbanContext';
import { Skeleton, useQueryState } from 'erxes-ui';
import { useEffect, useState } from 'react';

import { IStage } from '@/deals/types/stages';
import { InView } from 'react-intersection-observer';
import { Stage } from './Stage';
import { StageHeader } from './StageHeader';
import { StagesLoading } from '@/deals/components/loading/StagesLoading';
import { useDeals } from '@/deals/cards/hooks/useDeals';
import { useInView } from 'react-intersection-observer';
import { useStages } from '@/deals/stage/hooks/useStages';

export const StagesList = () => {
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
  }, [list, pipelineId]);

  useEffect(() => {
    setColumns(stages || []);
  }, [stages, pipelineId]);

  if (stagesLoading) {
    return <StagesLoading />;
  }

  // return (
  //   <MultipleContainers
  //     containerStyle={{
  //       maxHeight: '80vh',
  //     }}
  //     scrollable
  //   />
  // );

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
            <KanbanCards id={column._id} loading={false}>
              {(feature: (typeof features)[number]) => (
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

  // return (
  //   <div className="w-full h-full overflow-x-auto">
  //     <DraggableGroup direction="horizontal">
  //       {(stages || ([] as IStage[])).map((stage) => (
  //         <InView key={stage._id} triggerOnce rootMargin="200px">
  //           {({ inView, ref }) => (
  //             <div
  //               ref={ref}
  //               className="w-72 flex-none bg-gradient-to-b from-[#e0e7ff] to-[#e0e7ff50] rounded-t-lg  h-full flex flex-col overflow-hidden"
  //             >
  //               {inView ? (
  //                 <Stage stage={stage} />
  //               ) : (
  //                 <Skeleton className="w-72 h-full rounded-md" />
  //               )}
  //             </div>
  //           )}
  //         </InView>
  //       ))}
  //     </DraggableGroup>
  //   </div>
  // );
};
