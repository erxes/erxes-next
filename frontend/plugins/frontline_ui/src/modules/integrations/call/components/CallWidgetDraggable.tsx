import * as PopoverPrimitive from '@radix-ui/react-popover';
import { IconGripVertical } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { createContext, useContext, useMemo, memo, useCallback } from 'react';
import { useAtom } from 'jotai';
import { callWidgetPositionState } from '@/integrations/call/states/callWidgetStates';

// Memoize context to prevent recreating on every render
const DragContext = createContext<{
  listeners: any;
  attributes: any;
}>({
  listeners: {},
  attributes: {},
});

// Memoize draggable component
export const CallWidgetDraggable = memo(
  ({
    children,
    position,
  }: {
    children: React.ReactNode;
    position: { x: number; y: number };
  }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: 'call-widget',
    });

    // Memoize style object to prevent recreating on every render
    const style = useMemo(
      () => ({
        transform: `translate(${position.x + (transform?.x ?? 0)}px, ${
          position.y + (transform?.y ?? 0)
        }px)`,
      }),
      [position.x, position.y, transform?.x, transform?.y],
    );

    // Memoize context value to prevent child rerenders
    const contextValue = useMemo(
      () => ({
        listeners,
        attributes,
      }),
      [listeners, attributes],
    );

    return (
      <DragContext.Provider value={contextValue}>
        <PopoverPrimitive.Trigger
          className="fixed bottom-10 right-10 h-px z-50 w-96"
          ref={setNodeRef}
          style={style}
        />

        {children}
      </DragContext.Provider>
    );
  },
);

CallWidgetDraggable.displayName = 'CallWidgetDraggable';

// Memoize drag handle
export const DraggableHandle = memo(() => {
  const { listeners, attributes } = useContext(DragContext);

  return (
    <Button variant="secondary" size="icon" {...listeners} {...attributes}>
      <IconGripVertical />
    </Button>
  );
});

DraggableHandle.displayName = 'DraggableHandle';

export const CallWidgetDraggableRoot = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [position, setPosition] = useAtom(callWidgetPositionState);

  // Memoize drag end handler to prevent recreating function
  const handleDragEnd = useCallback((event: any) => {
    const { delta } = event;
    setPosition((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  }, []);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <CallWidgetDraggable position={position}>{children}</CallWidgetDraggable>
    </DndContext>
  );
};
