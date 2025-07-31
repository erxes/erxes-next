import {
  AnimateLayoutChanges,
  SortableContext,
  SortingStrategy,
  arrayMove,
  defaultAnimateLayoutChanges,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  CancelDrop,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardCoordinateGetter,
  MeasuringStrategy,
  Modifiers,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
// import { Container, ContainerProps } from './sortable/components';
import React, { useRef, useState } from 'react';

import { CSS } from '@dnd-kit/utilities';
import { IStage } from '../../types/stages';
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

// const animateLayoutChanges: AnimateLayoutChanges = (args) =>
//   defaultAnimateLayoutChanges({ ...args, wasDragging: true });

// export function DroppableContainer({
//   children,
//   columns = 1,
//   disabled,
//   id,
//   items,
//   style,
//   ...props
// }: ContainerProps & {
//   disabled?: boolean;
//   id: UniqueIdentifier;
//   items: UniqueIdentifier[];
//   style?: React.CSSProperties;
// }) {
//   const {
//     active,
//     attributes,
//     isDragging,
//     listeners,
//     over,
//     setNodeRef,
//     transition,
//     transform,
//   } = useSortable({
//     id,
//     data: {
//       type: 'container',
//       children: items,
//     },
//     animateLayoutChanges,
//   });
//   const isOverContainer = over
//     ? (id === over.id && active?.data.current?.type !== 'container') ||
//       items.includes(over.id)
//     : false;

//   return (
//     <Container
//       ref={disabled ? undefined : setNodeRef}
//       style={{
//         ...style,
//         transition,
//         transform: CSS.Translate.toString(transform),
//         opacity: isDragging ? 0.5 : undefined,
//       }}
//       hover={isOverContainer}
//       handleProps={{
//         ...attributes,
//         ...listeners,
//       }}
//       columns={columns}
//       {...props}
//     >
//       {children}
//     </Container>
//   );
// }

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;
interface DraggableGroupProps {
  direction: DragDirection;
  // children: React.ReactNode;
  adjustScale?: boolean;
  cancelDrop?: CancelDrop;
  columns?: number;
  containerStyle?: React.CSSProperties;
  coordinateGetter?: KeyboardCoordinateGetter;
  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): React.CSSProperties;
  wrapperStyle?(args: { index: number }): React.CSSProperties;
  itemCount?: number;
  items: IStage[];
  handle?: boolean;
  renderItem?: any;
  strategy?: SortingStrategy;
  modifiers?: Modifiers;
  minimal?: boolean;
  trashable?: boolean;
  scrollable?: boolean;
  vertical?: boolean;
}

export const TRASH_ID = 'void';
const PLACEHOLDER_ID = 'placeholder';
// const empty: UniqueIdentifier[] = [];

export default function DraggableGroup({
  direction,
  // children,
  adjustScale = false,
  itemCount = 3,
  cancelDrop,
  columns,
  handle = false,
  items: initialItems,
  containerStyle,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  minimal = false,
  modifiers,
  renderItem,
  strategy = verticalListSortingStrategy,
  trashable = false,
  vertical = false,
  scrollable,
}: DraggableGroupProps) {
  // Use ids for sorting
  const [items, setItems] = useState(
    initialItems.map((_, i) => `item-${i}`) || [],
  );

  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[],
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // const lastOverId = useRef<UniqueIdentifier | null>(null);
  // const recentlyMovedToNewContainer = useRef(false);
  // const isSortingContainer =
  //   activeId != null ? containers.includes(activeId) : false;

  const [clonedItems, setClonedItems] = useState<Items | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // Choose sorting strategy based on direction prop
  const sortingStrategy =
    direction === 'horizontal'
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy;

  // const idToChildMap = initialItems.reduce<
  //   Record<string, React.ReactNode>
  // >((acc, child, index) => {
  //   acc[`item-${index}`] = child;
  //   return acc;
  // }, {});

  // const findContainer = (id: UniqueIdentifier) => {
  //   if (id in items) {
  //     return id;
  //   }

  //   return Object.keys(items).find((key) =>
  //     items[key as any].includes(id as any),
  //   );
  // };

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

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveId(active.id);
    setClonedItems(items as any);
    console.log('handleDragStart', active);
  }
  console.log('iii', containers);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: 'inline-grid',
          boxSizing: 'border-box',
          padding: 20,
          gridAutoFlow: vertical ? 'row' : 'column',
        }}
      >
        <SortableContext
          items={[...containers, PLACEHOLDER_ID]}
          strategy={sortingStrategy}
        >
          {containers.map((containerId, i) => {
            console.log('mmm', items[containerId], items, containerId);
            return (
              <div className="flex gap-3 p-4 pb-0 h-full select-none w-max">
                {items.map((id, index) => {
                  // return (
                  //   <SortableItem key={id} id={id}>
                  //     {idToChildMap[id]}
                  //   </SortableItem>
                  // );

                  return null;

                  //  return (
                  //   <DroppableContainer
                  //     key={containerId}
                  //     id={containerId}
                  //     label={minimal ? undefined : `Column ${containerId}`}
                  //     columns={columns}
                  //     items={items[containerId]}
                  //     scrollable={scrollable}
                  //     style={containerStyle}
                  //     unstyled={minimal}
                  //     // onRemove={() => handleRemove(containerId)}
                  //   >
                  //     <SortableContext items={items[containerId]} strategy={strategy}>
                  //       {items[containerId].map((value, index) => {
                  //         return (
                  //           <SortableItem
                  //             disabled={isSortingContainer}
                  //             key={value}
                  //             id={value}
                  //             index={index}
                  //             handle={handle}
                  //             style={getItemStyles}
                  //             wrapperStyle={wrapperStyle}
                  //             renderItem={renderItem}
                  //             containerId={containerId}
                  //             getIndex={getIndex}
                  //           />
                  //         );
                  //       })}
                  //     </SortableContext>
                  //   </DroppableContainer>
                  // );
                })}
              </div>
            );
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
}
