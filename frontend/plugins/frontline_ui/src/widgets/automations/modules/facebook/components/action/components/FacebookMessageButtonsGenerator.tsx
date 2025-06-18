import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconX } from '@tabler/icons-react';
import { Button, Card, cn, Input, Label } from 'erxes-ui';

export const FacebookMessageButtonsGenerator = ({
  buttons = [],
  setButtons,
  addButtonText = '+ Add button',
}: {
  buttons: any[];
  setButtons: (buttons: any[]) => void;
  addButtonText?: string;
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = buttons.findIndex((button) => button._id === active.id);
      const newIndex = buttons.findIndex((button) => button._id === over?.id);

      setButtons(arrayMove(buttons, oldIndex, newIndex));
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={buttons.map((button) => button._id)}
          strategy={verticalListSortingStrategy}
        >
          {buttons.map((button: any) => (
            <FacebookMessageButton
              button={button}
              setButton={(btn: any) =>
                setButtons(
                  buttons.map((button) =>
                    button._id === btn._id ? { ...button, ...btn } : button,
                  ),
                )
              }
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() =>
          setButtons([
            ...buttons,
            { _id: Math.random().toString(), text: '', isEditing: true },
          ])
        }
      >
        <Label>{addButtonText}</Label>
      </Button>
    </>
  );
};

const FacebookMessageButton = ({
  button,
  setButton,
}: {
  button: any;
  setButton: (button: any) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: button._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onSave = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget as HTMLInputElement;

    e.preventDefault();

    setButton({ ...button, text: value, isEditing: false });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...(!button.isEditing ? { ...attributes, ...listeners } : {})}
      className={cn(
        'p-3  flex flex-row gap-2 items-center justify-between',
        button.isEditing
          ? 'cursor-auto'
          : 'cursor-grab  active:cursor-grabbing',
      )}
      onDoubleClick={() => setButton({ ...button, isEditing: true })}
    >
      <div className="flex-1 border rounded-lg p-2">
        {button?.isEditing ? (
          <Input
            autoFocus
            value={button.text}
            onBlur={onSave}
            onChange={(e) =>
              setButton({ ...button, text: e.currentTarget.value })
            }
            onKeyDown={(e) => e.key === 'Enter' && onSave(e as any)}
          />
        ) : (
          button.text
        )}
      </div>
      <Button size="icon" variant="destructive">
        <IconX />
      </Button>
    </Card>
  );
};
