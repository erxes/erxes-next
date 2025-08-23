import { Popover as PopoverPrimitive } from 'radix-ui';
import { IconPhoneFilled, IconX } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useMemo, memo, useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { callWidgetPositionState } from '@/integrations/call/states/callWidgetStates';
import { callWidgetOpenAtom } from '@/integrations/call/states/callWidgetOpenAtom';

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
    const [open, setOpen] = useAtom(callWidgetOpenAtom);

    // Memoize style object to prevent recreating on every render
    const style = useMemo(
      () => ({
        transform: `translate(${position.x + (transform?.x ?? 0)}px, ${
          position.y + (transform?.y ?? 0)
        }px)`,
      }),
      [position.x, position.y, transform?.x, transform?.y],
    );

    return (
      <>
        <PopoverPrimitive.Trigger ref={setNodeRef} style={style} asChild>
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-10 right-10 z-50 size-12 [&>svg]:size-6 rounded-full bg-background shadow-lg hover:bg-background"
            onClick={() => setOpen(!open)}
            {...listeners}
            {...attributes}
          >
            {open ? <IconX /> : <IconPhoneFilled className="text-primary" />}
          </Button>
        </PopoverPrimitive.Trigger>

        {children}
      </>
    );
  },
);

CallWidgetDraggable.displayName = 'CallWidgetDraggable';

export const CallWidgetDraggableRoot = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const setOpen = useSetAtom(callWidgetOpenAtom);
  const [position, setPosition] = useAtom(callWidgetPositionState);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  // Memoize drag end handler to prevent recreating function
  const handleDragEnd = useCallback(
    (event: any) => {
      const { delta } = event;
      setPosition((prev) => ({
        x: Math.min(window.innerWidth - 100, prev.x + delta.x),
        y: Math.max((window.innerHeight - 100) * -1, prev.y + delta.y),
      }));
    },
    [setPosition],
  );
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={() => setOpen(false)}
      sensors={sensors}
    >
      <CallWidgetDraggable position={position}>{children}</CallWidgetDraggable>
    </DndContext>
  );
};
