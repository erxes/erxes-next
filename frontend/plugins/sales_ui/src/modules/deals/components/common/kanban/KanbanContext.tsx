import type {
  Announcements,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  KanbanBoardProps,
  KanbanCardProps,
  KanbanCardsProps,
  KanbanContextProps,
  KanbanHeaderProps,
  KanbanItemProps,
  KanbanProviderProps,
} from './types';
import { ScrollArea, cn } from 'erxes-ui';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { createContext, useContext, useState } from 'react';

import { CSS } from '@dnd-kit/utilities';
import { Card } from './Card';
import { IStage } from '@/deals/types/stages';
import { createPortal } from 'react-dom';
import tunnel from 'tunnel-rat';

const t = tunnel();
export type { DragEndEvent } from '@dnd-kit/core';

const KanbanContext = createContext<KanbanContextProps>({
  columns: [],
  data: [],
  activeCardId: null,
});

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  // const { isOver, setNodeRef } = useDroppable({
  //   id,
  // });

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        'w-72 h-full flex-none p-2 shadow-xs bg-babyBlue rounded-md transition-all',
        isDragging ? 'ring-primary' : 'ring-transparent',
        className,
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export const KanbanCard = <T extends KanbanItemProps = KanbanItemProps>({
  id,
  name,
  children,
  className,
  onClick,
}: KanbanCardProps<T> & { onClick?: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
  });
  const { activeCardId } = useContext(KanbanContext) as KanbanContextProps;
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div
        key={id}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        onClick={() => onClick?.()}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Card
          className={cn(
            'cursor-grab gap-4 rounded-md shadow-sm',
            isDragging && 'pointer-events-none cursor-grabbing opacity-30',
            className,
          )}
        >
          {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
        </Card>
      </div>
      {activeCardId === id && (
        <t.In>
          <Card
            className={cn(
              'cursor-grab gap-4 rounded-md shadow-sm ring-2 ring-primary',
              isDragging && 'cursor-grabbing',
              className,
            )}
          >
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </t.In>
      )}
    </>
  );
};

export const KanbanCards = <T extends KanbanItemProps = KanbanItemProps>({
  children,
  className,
  ...props
}: KanbanCardsProps<T>) => {
  const { data } = useContext(KanbanContext) as KanbanContextProps<T>;

  const filteredData = data.filter((item) => item.column === props.id);
  const items = filteredData.map((item) => item.id);

  return (
    <ScrollArea className="flex-1 overflow-auto">
      <SortableContext items={items}>
        <div
          className={cn('flex flex-grow flex-col gap-3', className)}
          {...props}
        >
          {filteredData.map(children)}
        </div>
      </SortableContext>
      {/* <ScrollBar orientation="vertical" /> */}
    </ScrollArea>
  );
};

export const KanbanHeader = ({ className, ...props }: KanbanHeaderProps) => (
  <div className={cn('m-0 p-2 font-semibold text-sm', className)} {...props} />
);

export const KanbanProvider = <
  T extends KanbanItemProps = KanbanItemProps,
  C extends IStage = IStage,
>({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
  columns,
  data,
  onDataChange,
  onColumnsChange,
  ...props
}: KanbanProviderProps<T, C>) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );
  const handleDragStart = (event: DragStartEvent) => {
    const card = data.find((item) => item.id === event.active.id);
    if (card) {
      setActiveCardId(event.active.id as string);
    }
    onDragStart?.(event);
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeColumnIndex = columns.findIndex((col) => col._id === active.id);
    const overColumnIndex = columns.findIndex((col) => col._id === over.id);

    if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
      const newColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);
      // Add an `onColumnsChange` prop to update column order
      onColumnsChange?.(newColumns);
      return;
    }

    const activeItem = data.find((item) => item.id === active.id);
    const overItem = data.find((item) => item.id === over.id);
    if (!(activeItem && overItem)) {
      return;
    }

    const activeColumn = activeItem.column;
    const overColumn = overItem.column;
    if (activeColumn !== overColumn) {
      let newData = [...data];
      const activeIndex = newData.findIndex((item) => item.id === active.id);
      const overIndex = newData.findIndex((item) => item.id === over.id);
      newData[activeIndex].column = overColumn;
      newData = arrayMove(newData, activeIndex, overIndex);
      onDataChange?.(newData);
    }
    onDragOver?.(event);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveCardId(null);
    onDragEnd?.(event);

    if (!over || active.id === over.id) {
      return;
    }
    // let newData = [...data];

    const activeColumnIndex = columns.findIndex((col) => col._id === active.id);
    const overColumnIndex = columns.findIndex((col) => col._id === over.id);

    const activeCardIndex = data.findIndex((item) => item.id === active.id);
    const overCardIndex = data.findIndex((item) => item.id === over.id);

    // COLUMN DRAG
    if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
      const newColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);
      // Add an `onColumnsChange` prop to update column order
      onColumnsChange?.(newColumns);
      return;
    }

    // CARD DRAG
    if (activeCardIndex !== -1 && overCardIndex !== -1) {
      const newData = arrayMove(data, activeCardIndex, overCardIndex);
      onDataChange?.(newData);
    }

    onDragEnd?.(event);
  };
  const announcements: Announcements = {
    onDragStart({ active }) {
      const { name, column } = data.find((item) => item.id === active.id) ?? {};
      return `Picked up the card "${name}" from the "${column}" column`;
    },
    onDragOver({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column._id === over?.id)?.name;
      return `Dragged the card "${name}" over the "${newColumn}" column`;
    },
    onDragEnd({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column._id === over?.id)?.name;
      return `Dropped the card "${name}" into the "${newColumn}" column`;
    },
    onDragCancel({ active }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      return `Cancelled dragging the card "${name}"`;
    },
  };
  return (
    <KanbanContext.Provider value={{ columns, data, activeCardId }}>
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...props}
      >
        <SortableContext items={columns.map((c) => c._id)}>
          <div className={cn('grid size-full grid-flow-col gap-4', className)}>
            {columns.map((column) => children(column))}
          </div>
        </SortableContext>
        {typeof window !== 'undefined' &&
          createPortal(
            <DragOverlay>
              <t.Out />
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </KanbanContext.Provider>
  );
};
