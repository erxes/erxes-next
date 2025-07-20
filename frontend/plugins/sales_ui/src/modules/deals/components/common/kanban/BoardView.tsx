import { IconCalendarCheck, IconCalendarClock } from '@tabler/icons-react';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanProvider,
} from './KanbanContext';
import { useEffect, useState } from 'react';

import { DealsDatePicker } from '@/deals/cards/components/common/DealsDatePicker';
import { EntitySelector } from '@/deals/cards/components/item/EntitySelector';
import { IDeal } from '@/deals/types/deals';
import { IStage } from '@/deals/types/stages';
import { ItemFooter } from '@/deals/cards/components/item/Footer';
import { KanbanItemProps } from './types';
import { StageHeader } from '@/deals/stage/components/StageHeader';
import { useQueryState } from 'erxes-ui';

const BoardView = ({
  stages,
  deals,
  dealsLoading,
}: {
  stages: IStage[];
  deals: IDeal[];
  dealsLoading: boolean;
}) => {
  const [features, setFeatures] = useState<KanbanItemProps[]>([]);
  const [columns, setColumns] = useState(stages);

  const [, setSalesItemId] = useQueryState<string>('salesItemId');

  useEffect(() => {
    if (!deals) return; // or if dealsLoading, return;

    const mappedFeatures = deals.map((deal) => ({
      id: deal._id,
      name: deal.name,
      column: deal.stage?._id || '',
      startDate: deal.startDate,
      closeDate: deal.closeDate,
      createdAt: deal.createdAt,
      assignedUsers: deal.assignedUsers,
      // any other props you want
    }));

    setFeatures(mappedFeatures);
  }, [deals]);

  return (
    <KanbanProvider
      columns={columns}
      data={features}
      onDataChange={setFeatures}
      onColumnsChange={setColumns}
    >
      {(column) => {
        return (
          <KanbanBoard id={column._id} key={column._id}>
            <StageHeader stage={column} />
            <KanbanCards id={column._id}>
              {(feature: (typeof features)[number]) => {
                return (
                  <KanbanCard
                    {...feature}
                    key={feature.id}
                    column={column._id}
                    onClick={() => setSalesItemId(feature.id)}
                  >
                    <div className="flex justify-between border-b p-2">
                      <DealsDatePicker
                        date={feature.startDate}
                        Icon={IconCalendarClock}
                        text="Start Date"
                      />
                      <DealsDatePicker
                        date={feature.closeDate}
                        Icon={IconCalendarCheck}
                        text="Close Date"
                      />
                    </div>
                    <div className="flex flex-col h-full p-2 gap-2">
                      <b>{feature.name || 'Untitled Sales'}</b>
                      <EntitySelector card={feature} />
                    </div>
                    <ItemFooter
                      createdAt={feature.createdAt}
                      assignedUsers={feature.assignedUsers}
                    />
                  </KanbanCard>
                );
              }}
            </KanbanCards>
          </KanbanBoard>
        );
      }}
    </KanbanProvider>
  );
};

export default BoardView;
