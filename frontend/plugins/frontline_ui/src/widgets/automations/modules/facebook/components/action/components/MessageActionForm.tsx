import {
  DndContext,
  closestCenter,
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
import { zodResolver } from '@hookform/resolvers/zod';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import { Badge, Button, Card, Collapsible, Label, Separator } from 'erxes-ui';
import { Control, useForm, UseFormSetValue } from 'react-hook-form';
import { FacebookCardsMessage } from '~/widgets/automations/modules/facebook/components/action/components/FacebookCardsMessage';
import { FacebookQuickRepliesMessage } from '~/widgets/automations/modules/facebook/components/action/components/FacebookQuickRepliesMessage';
import { FacebookTextMessage } from '~/widgets/automations/modules/facebook/components/action/components/FacebookTextMessage';
import {
  INITIAL_OBJ_MESSAGE_TYPES,
  REPLY_MESSAGE_ACTION_BUTTONS,
} from '~/widgets/automations/modules/facebook/components/action/constants/ReplyMessage';
import {
  replyMessageFormSchema,
  TBotMessage,
  TMessageActionForm,
} from '~/widgets/automations/modules/facebook/components/action/states/replyMessageActionForm';
import { MessageActionTypeNames } from '~/widgets/automations/modules/facebook/components/action/types/messageActionForm';
import { CSS } from '@dnd-kit/utilities';

export const MessageActionForm = ({
  currentAction,
  onSaveActionConfig,
}: any) => {
  const form = useForm<TMessageActionForm>({
    resolver: zodResolver(replyMessageFormSchema),
    defaultValues: { ...(currentAction?.config || {}) },
  });

  const { control, watch, setValue, setError, handleSubmit } = form;

  const messages = watch('messages') || [];

  const addMessage = (type: MessageActionTypeNames) => {
    if (messages.length === 5) {
      return setError('messages', {
        message: 'You can only 5 messages per action',
      });
    }

    const initialValues = INITIAL_OBJ_MESSAGE_TYPES[type];

    setValue('messages', [
      ...messages,
      { _id: Math.random().toString(), type, ...initialValues },
    ]);
  };

  return (
    <div className="w-[670px]  flex flex-col h-full">
      <div className="flex flex-row gap-2 items-center px-6 py-2">
        <Label>Message Sequence</Label>
        <Badge variant="secondary">{`${messages.length} messages`}</Badge>
      </div>
      <div className="inline-flex gap-2 overflow-x-auto w-full p-2  ">
        {REPLY_MESSAGE_ACTION_BUTTONS.map(({ title, type, icon: Icon }) => (
          <Button
            key={type}
            variant="outline"
            onClick={() => addMessage(type as MessageActionTypeNames)}
          >
            <Icon />
            {`Add ${title}`}
          </Button>
        ))}
      </div>
      <div className="flex-1 overflow-x-auto px-6 py-2">
        <FacebookMessages
          messages={messages}
          control={control}
          setValue={setValue}
        />
      </div>
      <div className="p-2 flex justify-end border-t bg-white">
        <Button
          onClick={handleSubmit(onSaveActionConfig, (prop) =>
            console.log(prop),
          )}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

const FacebookMessages = ({
  messages,
  setValue,
  control,
}: {
  messages: TBotMessage[];
  control: Control<TMessageActionForm>;
  setValue: UseFormSetValue<TMessageActionForm>;
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = messages.findIndex(
        (message) => message._id === active.id,
      );
      const newIndex = messages.findIndex(
        (message) => message._id === over?.id,
      );

      setValue('messages', arrayMove(messages, oldIndex, newIndex));
    }
  };

  const onRemove = (index: number) => {
    setValue(
      'messages',
      messages.filter((_, messageIndex) => messageIndex !== index),
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={messages.map((message) => message._id)}
        strategy={verticalListSortingStrategy}
      >
        {messages.map((message, index) => (
          <FacebookBotMessage
            key={message._id}
            index={index}
            control={control}
            message={message}
            onRemove={onRemove}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

const FacebookBotMessage = ({
  index,
  message,
  control,
  onRemove,
}: {
  index: number;
  message: TBotMessage;
  control: Control<TMessageActionForm>;
  onRemove: (index: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: message._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { title = '', icon: Icon = () => null } =
    REPLY_MESSAGE_ACTION_BUTTONS.find(({ type }) => message.type === type) ||
    {};

  return (
    <Card ref={setNodeRef} style={style} {...attributes} className="mt-4 ">
      <Collapsible>
        <Collapsible.Trigger asChild>
          <Card.Title className="flex flex-row gap-2 p-4 text-lg items-center cursor-ns-resize">
            <div
              {...listeners}
              className="cursor-grab hover:bg-gray-100 active:cursor-grabbing p-2 rounded text-accent-foreground"
            >
              <IconGripVertical className="w-4 h-4" />
            </div>
            <div className="flex-1 flex flex-row gap-2 items-center">
              {Icon && <Icon />} {`${title} Message`}
            </div>
            <div className="flex flex-row gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onRemove(index)}
              >
                <IconTrash />
              </Button>
            </div>
          </Card.Title>
        </Collapsible.Trigger>
        <Separator />
        <Collapsible.Content>
          <Card.Content className="pt-4">
            <FacebookMessageContent
              index={index}
              message={message}
              control={control}
            />
          </Card.Content>
        </Collapsible.Content>
      </Collapsible>
    </Card>
  );
};

const FacebookMessageContent = ({
  index,
  message,
  control,
}: {
  index: number;
  message: TBotMessage;
  control: Control<TMessageActionForm>;
}) => {
  switch (message.type) {
    case 'text':
      return (
        <FacebookTextMessage
          index={index}
          message={message}
          control={control}
        />
      );
    // case "image":
    //   return renderImage(props);
    case 'card':
      return (
        <FacebookCardsMessage
          message={message}
          control={control}
          index={index}
        />
      );
    case 'quickReplies':
      return (
        <FacebookQuickRepliesMessage
          message={message}
          control={control}
          index={index}
        />
      );
    // case "audio":
    //   return renderAudio(props);
    // case "video":
    //   return renderVideo(props);
    // case "attachments":
    //   return renderAttachements(props);
    // case "input":
    //   return renderInput(props);
    default:
      return null;
  }
};
