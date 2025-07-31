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
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  KanbanBoardProps,
  KanbanCardProps,
  KanbanCardsProps,
  KanbanContextProps,
  KanbanHeaderProps,
  KanbanProviderProps,
} from './types';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { createContext, useContext, useState } from 'react';

import { CSS } from '@dnd-kit/utilities';
import { Card } from './Card';
import { CardsLoading } from '../../loading/CardsLoading';
import { IDeal } from '@/deals/types/deals';
import { IStage } from '@/deals/types/stages';
import { cn } from 'erxes-ui';
import { createPortal } from 'react-dom';
import tunnel from 'tunnel-rat';

const t = tunnel();
export type { DragEndEvent } from '@dnd-kit/core';

export const getTypeAndId = (id: string) => {
  const [type, ...rest] = id.split('-');
  return { type, id: rest.join('-') };
};

const KanbanContext = createContext<KanbanContextProps>({
  columns: [],
  data: [],
  activeCardId: null,
});

export const KanbanBoard = ({ _id, children, className }: KanbanBoardProps) => {
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
  } = useSortable({ id: `column-${_id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        'w-72 h-full flex-none p-2 shadow-xs bg-gradient-to-b from-[#e0e0e0] to-[#e0e7ff50] rounded-md transition-all',
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

export const KanbanCard = ({
  name,
  children,
  className,
  onClick,
  loading,
  columnId,
  featureId,
}: KanbanCardProps & {
  onClick?: () => void;
  loading?: boolean;
  columnId: string;
  featureId: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `card-${featureId}` });
  const { activeCardId } = useContext(KanbanContext) as KanbanContextProps;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div
        key={featureId}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
      >
        <Card
          className={cn(
            'cursor-grab gap-4 rounded-md shadow-sm',
            isDragging && 'pointer-events-none cursor-grabbing opacity-30',
            className,
          )}
          loading={loading}
        >
          {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
        </Card>
      </div>
      {activeCardId === featureId && (
        <t.In>
          <Card
            className={cn(
              'cursor-grab gap-4 rounded-md shadow-sm ring-2 ring-primary',
              isDragging && 'cursor-grabbing',
              className,
            )}
            loading={loading}
          >
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </t.In>
      )}
    </>
  );
};

export const KanbanCards = <T extends IDeal = IDeal>({
  children,
  className,
  loading,
  ...props
}: KanbanCardsProps<T> & { loading: boolean }) => {
  const { data } = useContext(KanbanContext) as KanbanContextProps<T>;

  const { id } = props; // stage id

  const { setNodeRef } = useDroppable({
    id: `column-${id}`, // droppable id matching sortable column id
  });

  const filteredData = data.filter((item) => item.stage?._id === props.id);

  const items = filteredData.map((item) => `card-${item._id}`);

  if (loading) {
    return <CardsLoading />;
  }

  return (
    <div
      ref={setNodeRef}
      className="overflow-auto h-full"
      style={{
        height: 'calc(100vh - 180px)',
      }}
    >
      <SortableContext items={items}>
        <div
          className={cn('flex flex-grow flex-col gap-3', className)}
          {...props}
        >
          {filteredData.map(children)}
        </div>
      </SortableContext>
    </div>
  );
};

export const KanbanHeader = ({ className, ...props }: KanbanHeaderProps) => (
  <div className={cn('m-0 p-2 font-semibold text-sm', className)} {...props} />
);

export const KanbanProvider = <
  T extends IDeal = IDeal,
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
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { type, id } = getTypeAndId(event.active.id as string);

    if (type === 'card') {
      const card = data.find((item) => item._id === id);

      if (card) {
        setActiveCardId(`card-${id}`); // use full ID since that's what useSortable uses
      }
    }

    onDragStart?.(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    console.log('handleDragOver', active, over);
    const { type: activeType, id: activeId } = getTypeAndId(
      active.id as string,
    );
    const { type: overType, id: overId } = getTypeAndId(over.id as string);

    console.log('handleDragOver', active, over, columns);

    // COLUMN DRAGGING
    if (activeType === 'column' && overType === 'column') {
      const activeIndex = columns.findIndex((col) => col._id === activeId);
      const overIndex = columns.findIndex((col) => col._id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        onColumnsChange?.(newColumns);
      }
      return;
    }

    if (activeType === 'card' && overType === 'column') {
      const newData = [...data];
      const activeIndex = newData.findIndex((item) => item._id === activeId);
      if (activeIndex === -1) return;

      const targetColumn = columns.find((col) => col._id === overId);
      if (!targetColumn) return;

      newData[activeIndex] = {
        ...newData[activeIndex],
        stage: targetColumn,
      };

      onDataChange?.(newData);
      return;
    }

    // CARD DRAGGING
    if (activeType === 'card' && overType === 'card') {
      const activeItem = data.find((item) => item._id === activeId);
      const overItem = data.find((item) => item._id === overId);
      if (!(activeItem && overItem)) return;

      if (activeItem.stage?._id !== overItem.stage?._id) {
        let newData = [...data];

        const activeIndex = newData.findIndex((item) => item._id === activeId);
        const overIndex = newData.findIndex((item) => item._id === overId);

        if (activeIndex === -1 || overIndex === -1) return;

        // Update stage object by copying overItem.stage to active card
        const updatedActiveItem = {
          ...newData[activeIndex],
          stage: { ...overItem.stage },
        };
        newData[activeIndex] = updatedActiveItem;

        newData = arrayMove(newData, activeIndex, overIndex);

        onDataChange?.(newData);
      }
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

    const { type: activeType, id: activeId } = getTypeAndId(
      active.id as string,
    );
    const { type: overType, id: overId } = getTypeAndId(over.id as string);

    // let newData = [...data];
    console.log('handleDragEnd', active, over, columns);
    // COLUMN DRAG
    if (activeType === 'column' && overType === 'column') {
      const activeColumnIndex = columns.findIndex(
        (col) => col._id === activeId,
      );
      const overColumnIndex = columns.findIndex((col) => col._id === overId);

      if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
        const newColumns = arrayMove(
          columns,
          activeColumnIndex,
          overColumnIndex,
        );
        onColumnsChange?.(newColumns);
      }
      return;
    }

    if (activeType === 'card' && overType === 'column') {
      const newData = [...data];
      const activeIndex = newData.findIndex((item) => item._id === activeId);
      if (activeIndex === -1) return;

      const targetColumn = columns.find((col) => col._id === overId);
      if (!targetColumn) return;

      newData[activeIndex] = {
        ...newData[activeIndex],
        stage: targetColumn,
      };

      onDataChange?.(newData);
      return;
    }

    // CARD DRAG
    if (activeType === 'card' && overType === 'card') {
      const activeItem = data.find((item) => item._id === activeId);
      const overItem = data.find((item) => item._id === overId);
      if (!(activeItem && overItem)) return;

      const newData = [...data];
      const activeIndex = newData.findIndex((item) => item._id === activeId);
      if (activeIndex === -1) return;

      // Clone and update active card's stage if different
      if (activeItem.stage?._id !== overItem.stage?._id) {
        newData[activeIndex] = {
          ...newData[activeIndex],
          stage: { ...overItem.stage },
        };
      }

      // Get all cards in the target stage (after update if changed)
      const targetStageId = newData[activeIndex].stage?._id;
      const cardsInStage = newData.filter(
        (item) => item.stage?._id === targetStageId,
      );

      const activePos = cardsInStage.findIndex((item) => item._id === activeId);
      const overPos = cardsInStage.findIndex((item) => item._id === overId);

      if (activePos === -1 || overPos === -1) return;

      const reorderedCards = arrayMove(cardsInStage, activePos, overPos);

      const otherCards = newData.filter(
        (item) => item.stage?._id !== targetStageId,
      );

      const mergedData = [...otherCards, ...reorderedCards];

      onDataChange?.(mergedData);
    }

    onDragEnd?.(event);
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      const { type, id } = getTypeAndId(active.id as string);

      if (type !== 'card') return;

      const item = data.find((item) => item._id === id);
      if (!item) return;

      return `Picked up the card "${item.name}" from the "${item.stage?.name}" column`;
    },

    onDragOver({ active, over }) {
      const { type, id } = getTypeAndId(active.id as string);
      const { id: overId } = getTypeAndId(over?.id as string);

      if (type !== 'card') return;

      const item = data.find((item) => item._id === id);
      const column = columns.find((col) => col._id === overId);

      return `Dragged the card "${item?.name}" over the "${column?.name}" column`;
    },

    onDragEnd({ active, over }) {
      const { type, id } = getTypeAndId(active.id as string);
      const { id: overId } = getTypeAndId(over?.id as string);

      if (type !== 'card') return;

      const item = data.find((item) => item._id === id);
      const column = columns.find((col) => col._id === overId);

      return `Dropped the card "${item?.name}" into the "${column?.name}" column`;
    },

    onDragCancel({ active }) {
      const { type, id } = getTypeAndId(active.id as string);

      if (type !== 'card') return;

      const item = data.find((item) => item._id === id);

      return `Cancelled dragging the card "${item?.name}"`;
    },
  };
  console.log('announcements', columns, data, activeCardId);
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
        <SortableContext items={columns.map((c) => `column-${c._id}`)}>
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
