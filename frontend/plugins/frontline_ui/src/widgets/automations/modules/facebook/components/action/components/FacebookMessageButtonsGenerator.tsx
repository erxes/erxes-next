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
import { IconGripVertical, IconX } from '@tabler/icons-react';
import { Button, Card, cn, Input, Label } from 'erxes-ui';
import { TBotMessageButton } from '../states/replyMessageActionForm';

export const FacebookMessageButtonsGenerator = ({
  buttons = [],
  setButtons,
  addButtonText = '+ Add button',
  limit,
}: {
  buttons: TBotMessageButton[];
  setButtons: (buttons: TBotMessageButton[]) => void;
  addButtonText?: string;
  limit: number;
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

  const handleChangeButton = (btn: TBotMessageButton) => {
    const updatedButtons = buttons.map((button) =>
      button._id === btn._id ? { ...button, ...btn } : button,
    );

    console.log({ updatedButtons });

    setButtons(updatedButtons);
  };

  const onAddButton = () =>
    setButtons([
      ...buttons,
      { _id: Math.random().toString(), text: '', isEditing: true },
    ]);

  const onRemovButton = (index: number) => {
    setButtons(buttons.filter((_, buttonIndex) => buttonIndex !== index));
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
          {buttons.map((button: TBotMessageButton, index: number) => (
            <FacebookMessageButton
              key={index}
              button={button}
              handleChangeButton={handleChangeButton}
              onRemovButton={() => onRemovButton(index)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        variant="secondary"
        className="w-full"
        disabled={buttons.length >= limit}
        onClick={onAddButton}
      >
        <Label>{addButtonText}</Label>
      </Button>
    </>
  );
};

const FacebookMessageButton = ({
  button,
  handleChangeButton,
  onRemovButton,
}: {
  button: TBotMessageButton;
  handleChangeButton: (button: TBotMessageButton) => void;
  onRemovButton: () => void;
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

    handleChangeButton({ ...button, text: value, isEditing: false });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...(!button.isEditing ? { ...attributes } : {})}
      className={'p-3  flex flex-row gap-2 items-center justify-between'}
      onDoubleClick={() => handleChangeButton({ ...button, isEditing: true })}
    >
      <div
        {...listeners}
        className={cn(
          'p-2 rounded hover:bg-muted text-accent-foreground',
          button.isEditing
            ? 'cursor-auto'
            : 'cursor-grab  active:cursor-grabbing',
        )}
      >
        <IconGripVertical className="w-4 h-4" />
      </div>
      <div className="flex-1 border rounded-lg p-2 flex items-center">
        {button?.isEditing ? (
          <Input
            autoFocus
            value={button.text}
            onBlur={onSave}
            onChange={(e) =>
              handleChangeButton({ ...button, text: e.currentTarget.value })
            }
            onKeyDown={(e) => e.key === 'Enter' && onSave(e as any)}
          />
        ) : (
          <span className="font-mono font-bold text-foreground text-sm">
            {button.text || 'Type a button label'}
          </span>
        )}
      </div>
      <Button size="icon" variant="destructive" onClick={onRemovButton}>
        <IconX />
      </Button>
    </Card>
  );
};
