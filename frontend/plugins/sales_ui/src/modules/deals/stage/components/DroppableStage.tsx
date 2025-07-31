import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { IStage } from '@/deals/types/stages';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';

interface Props {
  stage: IStage;
  children: React.ReactNode;
}

export const DroppableStage = ({ stage, children }: Props) => {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: stage._id,
    data: {
      type: 'stage',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SortableContext items={[]} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </div>
  );
};
