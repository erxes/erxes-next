import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import React, { useState } from 'react';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { cn } from 'erxes-ui';

type DragDirection = 'vertical' | 'horizontal';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('rounded-lg relative h-full', isDragging && 'bg-muted')}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-lg',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        {...attributes}
        {...listeners}
      />
      {children}
    </div>
  );
}

interface DraggableGroupProps {
  direction: DragDirection;
  children: React.ReactNode;
}

export default function DraggableGroup({
  direction,
  children,
}: DraggableGroupProps) {
  // Use ids for sorting
  const [items, setItems] = useState(
    React.Children.map(children, (_, i) => `item-${i}`) || [],
  );

  const sensors = useSensors(useSensor(PointerSensor));

  // Choose sorting strategy based on direction prop
  const sortingStrategy =
    direction === 'horizontal'
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy;

  const idToChildMap = React.Children.toArray(children).reduce<
    Record<string, React.ReactNode>
  >((acc, child, index) => {
    acc[`item-${index}`] = child;
    return acc;
  }, {});

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={sortingStrategy}>
        <div className="flex gap-3 p-4 pb-0 h-full select-none w-max">
          {items.map((id, index) => (
            <SortableItem key={id} id={id}>
              {idToChildMap[id]}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
