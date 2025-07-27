import * as PopoverPrimitive from '@radix-ui/react-popover';
import {
  IconGripHorizontal,
  IconPhoneFilled,
  IconX,
} from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { createContext, useContext, useMemo, memo, useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { callWidgetPositionState } from '@/integrations/call/states/callWidgetStates';
import { callWidgetOpenAtom } from '@/integrations/call/states/callWidgetOpenAtom';

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
    const open = useAtomValue(callWidgetOpenAtom);

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
        <PopoverPrimitive.Trigger ref={setNodeRef} style={style} asChild>
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-10 right-10 z-50 size-12 [&>svg]:size-6 rounded-full bg-background shadow-lg hover:bg-background"
          >
            {open ? <IconX /> : <IconPhoneFilled className="text-primary" />}
          </Button>
        </PopoverPrimitive.Trigger>

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
    <Button
      variant="ghost"
      size="icon"
      {...listeners}
      {...attributes}
      className="cursor-move text-accent-foreground h-auto my-1"
    >
      <IconGripHorizontal />
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
