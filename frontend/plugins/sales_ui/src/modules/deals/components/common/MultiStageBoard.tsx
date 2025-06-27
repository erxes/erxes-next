import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import React, { useState } from 'react';

import { DraggableGroup } from './DraggableGroup';
import { arrayMove } from '@/deals/utils/arrayMove';

interface Card {
  id: string;
  title: string;
}

interface MultiStageBoardProps {
  initialColumns: Record<string, Card[]>;
}

export function MultiStageBoard({ initialColumns }: MultiStageBoardProps) {
  const [columns, setColumns] = useState(() =>
    Object.fromEntries(
      Object.entries(initialColumns).map(([stage, cards]) => [
        stage,
        cards.map((card) => card.id),
      ]),
    ),
  );

  const cardMap: Record<string, React.ReactNode> = Object.values(initialColumns)
    .flat()
    .reduce((acc, card) => {
      acc[card.id] = <div>{card.title}</div>;
      return acc;
    }, {} as Record<string, React.ReactNode>);

  const sensors = useSensors(useSensor(PointerSensor));

  const findContainer = (id: string) => {
    return Object.keys(columns).find((key) => columns[key].includes(id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const fromList = findContainer(active.id as string);
    const toList = findContainer(over.id as string);

    if (!fromList || !toList) return;

    if (fromList === toList) {
      const oldIndex = columns[fromList].indexOf(active.id as string);
      const newIndex = columns[toList].indexOf(over.id as string);
      setColumns((prev) => ({
        ...prev,
        [fromList]: arrayMove(prev[fromList], oldIndex, newIndex),
      }));
    } else {
      setColumns((prev) => {
        const fromItems = [...prev[fromList]];
        const toItems = [...prev[toList]];
        const draggedId = active.id as string;

        const fromIndex = fromItems.indexOf(draggedId);
        if (fromIndex !== -1) fromItems.splice(fromIndex, 1);

        const overIndex = toItems.indexOf(over.id as string);
        toItems.splice(overIndex + 1, 0, draggedId);

        return {
          ...prev,
          [fromList]: fromItems,
          [toList]: toItems,
        };
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', gap: 20, padding: 20 }}>
        {Object.entries(columns).map(([stageId, cardIds]) => (
          <DraggableGroup
            key={stageId}
            groupId={stageId}
            direction="vertical"
            items={cardIds}
            childrenMap={cardMap}
          />
        ))}
      </div>
    </DndContext>
  );
}
