import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';

import { IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { useStatusesByType } from '@/team/hooks/useGetStatus';
import { Status } from '@/team/components/status/Status';
import { useUpdateStatus } from '@/team/hooks/useUpdateStatus';

export const StatusGroup = ({ statusType }: { statusType: string }) => {
  const { statuses = [] } = useStatusesByType({ type: statusType });
  const { updateStatus } = useUpdateStatus();

  const [_statuses, _setStatuses] = useState(statuses);

  useEffect(() => {
    _setStatuses(statuses);
  }, [statuses]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = statuses.findIndex((status) => status._id === active.id);
    const newIndex = statuses.findIndex((status) => status._id === over.id);

    const newOrder = arrayMove(statuses, oldIndex, newIndex);

    newOrder.forEach((status, index) => {
      updateStatus({
        variables: {
          _id: status._id,
          order: index,
        },
      });
    });

    _setStatuses(newOrder);
  };

  return (
    <section className="w-full p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 justify-between w-full bg-slate-100 py-1 px-2 rounded-md">
          <div className="flex items-center gap-2">
            <p>{statusType.charAt(0).toUpperCase() + statusType.slice(1)}</p>
          </div>
          <Button variant="ghost" size="icon">
            <IconPlus className="stroke-foreground" />
          </Button>
        </div>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={_statuses.map((status) => status._id)}
          strategy={verticalListSortingStrategy}
        >
          {_statuses.map((status) => (
            <Status key={status._id} status={status} />
          ))}
        </SortableContext>
      </DndContext>
    </section>
  );
};
