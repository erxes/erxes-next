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

type DragDirection = 'vertical' | 'horizontal';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
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
    backgroundColor: isDragging ? '#e0e0e0' : 'white',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
        <div
          className="flex gap-3"
          style={{
            flexDirection: direction === 'horizontal' ? 'row' : 'column',
            width: direction === 'horizontal' ? '100%' : 300,
            userSelect: 'none',
          }}
        >
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
