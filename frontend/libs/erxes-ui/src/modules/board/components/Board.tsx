'use client';
import type {
  Announcements,
  DndContextProps,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScrollArea } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { Portal } from 'radix-ui';
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from 'react';
export type { DragEndEvent } from '@dnd-kit/core';

type BoardItemProps = {
  id: string;
  name: string;
  column: string;
} & Record<string, unknown>;

type BoardColumnProps = {
  id: string;
  name: string;
} & Record<string, unknown>;
type BoardContextProps<
  T extends BoardItemProps = BoardItemProps,
  C extends BoardColumnProps = BoardColumnProps,
> = {
  columns: C[];
  data: T[];
  activeCardId: string | null;
};
const BoardContext = createContext<BoardContextProps>({
  columns: [],
  data: [],
  activeCardId: null,
});
export type BoardProps = {
  id: string;
  children: ReactNode;
  className?: string;
};
const BoardRoot = ({ id, children, className }: BoardProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className={cn(
        'flex size-full min-h-40 min-w-80 flex-col overflow-hidden transition-all bg-gradient-to-b from-[#e0e7ff] to-[#e0e7ff50] rounded-t-md dark:from-primary/40 dark:to-primary/20',
        isOver && 'shadow-focus',
        className,
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};
export type BoardCardProps<T extends BoardItemProps = BoardItemProps> = T & {
  children?: ReactNode;
  className?: string;
};
const BoardCard = <T extends BoardItemProps = BoardItemProps>({
  id,
  name,
  children,
  className,
}: BoardCardProps<T>) => {
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
  const { activeCardId } = useContext(BoardContext) as BoardContextProps;
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <>
      <div style={style} {...listeners} {...attributes} ref={setNodeRef}>
        <div
          className={cn(
            'gap-4 rounded-lg shadow-sm outline-none bg-background',
            isDragging && 'pointer-events-none cursor-grabbing opacity-30',
            className,
          )}
        >
          {children}
        </div>
      </div>
      {activeCardId === id && (
        <Portal.Root asChild>
          <div>
            <DragOverlay>
              <div
                className={cn(
                  'cursor-grab gap-4 rounded-lg bg-background',
                  isDragging && 'cursor-grabbing shadow-focus',
                  className,
                )}
              >
                {children}
              </div>
            </DragOverlay>
          </div>
        </Portal.Root>
      )}
    </>
  );
};
export type BoardCardsProps<T extends BoardItemProps = BoardItemProps> = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'id'
> & {
  children: (item: T) => ReactNode;
  id: string;
};

const BoardCards = <T extends BoardItemProps = BoardItemProps>({
  children,
  className,
  ...props
}: BoardCardsProps<T>) => {
  const { data } = useContext(BoardContext) as BoardContextProps<T>;
  const filteredData = data.filter((item) => item.column === props.id);
  const items = filteredData.map((item) => item.id);
  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div
          className={cn(
            'flex flex-grow flex-col gap-2 p-2 pt-px relative',
            className,
          )}
          {...props}
        >
          {filteredData.map(children)}
        </div>
      </SortableContext>
      <ScrollArea.Bar orientation="vertical" />
    </ScrollArea>
  );
};
export type BoardHeaderProps = HTMLAttributes<HTMLDivElement>;
export const BoardHeader = ({ className, ...props }: BoardHeaderProps) => (
  <div
    className={cn(
      'm-0 px-3 h-10 flex-none font-semibold text-sm flex items-center justify-between',
      className,
    )}
    {...props}
  />
);
export type BoardProviderProps<
  T extends BoardItemProps = BoardItemProps,
  C extends BoardColumnProps = BoardColumnProps,
> = Omit<DndContextProps, 'children'> & {
  children: (column: C) => ReactNode;
  className?: string;
  columns: C[];
  data: T[];
  onDataChange?: (data: T[]) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
};

const BoardProvider = <
  T extends BoardItemProps = BoardItemProps,
  C extends BoardColumnProps = BoardColumnProps,
>({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
  columns,
  data,
  onDataChange,
  ...props
}: BoardProviderProps<T, C>) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
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
    const activeItem = data.find((item) => item.id === active.id);
    const overItem = data.find((item) => item.id === over.id);
    if (!activeItem) {
      return;
    }
    const activeColumn = activeItem.column;
    const overColumn =
      overItem?.column ||
      columns.find((col) => col.id === over.id)?.id ||
      columns[0]?.id;
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
    setActiveCardId(null);
    onDragEnd?.(event);
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    let newData = [...data];
    const oldIndex = newData.findIndex((item) => item.id === active.id);
    const newIndex = newData.findIndex((item) => item.id === over.id);
    newData = arrayMove(newData, oldIndex, newIndex);
    onDataChange?.(newData);
  };
  const announcements: Announcements = {
    onDragStart({ active }) {
      const { name, column } = data.find((item) => item.id === active.id) ?? {};
      return `Picked up the card "${name}" from the "${column}" column`;
    },
    onDragOver({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;
      return `Dragged the card "${name}" over the "${newColumn}" column`;
    },
    onDragEnd({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;
      return `Dropped the card "${name}" into the "${newColumn}" column`;
    },
    onDragCancel({ active }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      return `Cancelled dragging the card "${name}"`;
    },
  };
  return (
    <BoardContext.Provider value={{ columns, data, activeCardId }}>
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...props}
      >
        <div
          className={cn(
            'flex flex-auto gap-4 overflow-x-auto p-5 pb-0 styled-scroll',
            className,
          )}
        >
          {columns.map((column) => children(column))}
        </div>
      </DndContext>
    </BoardContext.Provider>
  );
};

export const Board = Object.assign(BoardRoot, {
  Provider: BoardProvider,
  Card: BoardCard,
  Cards: BoardCards,
  Header: BoardHeader,
});
