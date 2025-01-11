import {
  closestCenter,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';
import { ColumnOrderState } from '@tanstack/react-table';
import type { OnChangeFn } from '@tanstack/table-core';

interface RecordTableDnDProviderProps {
  children: React.ReactNode;
  setColumnOrder: OnChangeFn<ColumnOrderState>;
}

export const RecordTableDnDProvider = ({
  children,
  setColumnOrder,
}: RecordTableDnDProviderProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {})
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(
          columnOrder,
          oldIndex,
          newIndex === columnOrder.length - 1 ? newIndex - 1 : newIndex
        ); //this is just a splice util
      });
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis, restrictToFirstScrollableAncestor]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      autoScroll={false}
    >
      {children}
    </DndContext>
  );
};
