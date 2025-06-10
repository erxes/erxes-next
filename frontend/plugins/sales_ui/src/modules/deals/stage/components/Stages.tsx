import { DndContext, useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { Card } from '../../cards/Card';
import { StageHeader } from './StageHeader';

type Props = {
  stage: any;
  cards: any[];
  // onCardDrop: (cardId: string, newStageId: string) => void;
};

export const Stages = ({ stage, cards }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `stage-${stage._id}` });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `stage-${stage._id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: `${transition}, box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1)`,
    opacity: isDragging ? 0.8 : 1,
    cursor: 'grab',
    width: '280px',
    boxShadow: isDragging
      ? '0 8px 20px rgba(0, 0, 0, 0.15)' // soft shadow while dragging
      : 'none',
  };

  return (
    <div
      key={stage._id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-[280px] flex-none p-2 shadow-sm bg-babyBlue rounded-sm"
    >
      <StageHeader stage={stage} />
      <div
        ref={setDroppableRef}
        className="overflow-auto max-h-full mt-3 mb-3 min-h-[100px]  space-y-2"
      >
        <SortableContext
          items={cards.map((c) => c._id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <Card key={card._id} card={card} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
