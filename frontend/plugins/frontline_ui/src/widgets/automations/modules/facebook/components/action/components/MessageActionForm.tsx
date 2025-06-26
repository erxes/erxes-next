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
import {
  Badge,
  Button,
  Card,
  Collapsible,
  Label,
  Separator,
  toast,
} from 'erxes-ui';
import { Control, FieldPath, useForm, UseFormSetValue } from 'react-hook-form';
import { FacebookCardsMessage } from './FacebookCardsMessage';
import { FacebookQuickRepliesMessage } from './FacebookQuickRepliesMessage';
import { FacebookTextMessage } from './FacebookTextMessage';
import {
  INITIAL_OBJ_MESSAGE_TYPES,
  REPLY_MESSAGE_ACTION_BUTTONS,
} from '../constants/ReplyMessage';
import {
  replyMessageFormSchema,
  TBotMessage,
  TMessageActionForm,
} from '../states/replyMessageActionForm';
import { MessageActionTypeNames } from '../types/messageActionForm';
import { CSS } from '@dnd-kit/utilities';
import { AutomationActionFormProps } from 'ui-modules';
import { FacebookInputMessage } from '~/widgets/automations/modules/facebook/components/action/components/FacebookInputMessage';
import { nanoid } from 'nanoid';

export const MessageActionForm = ({
  currentAction,
  onSaveActionConfig,
}: AutomationActionFormProps<TMessageActionForm>) => {
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
      { _id: nanoid(), type, ...initialValues },
    ]);
  };

  return (
    <div className="w-[670px]  flex flex-col h-full">
      <div className="flex flex-row gap-2 items-center px-6 py-2">
        <Label>Message Sequence</Label>
        <Badge variant="secondary">{`${messages.length} messages`}</Badge>
      </div>
      <div className="inline-flex gap-2 overflow-x-auto w-full p-2  ">
        {REPLY_MESSAGE_ACTION_BUTTONS.map(
          ({ title, type, icon: Icon, inProgress }) => (
            <Button
              key={type}
              variant="outline"
              disabled={messages.length >= 5 || inProgress}
              onClick={() => addMessage(type as MessageActionTypeNames)}
            >
              <Icon />
              {`Add ${title} ${inProgress ? '( Work in progress )' : ''}`}
            </Button>
          ),
        )}
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
          onClick={handleSubmit(onSaveActionConfig, (prop) => {
            toast({
              title: 'There is some error on field of form',
              variant: 'destructive',
            });
          })}
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

  const handleMessageChange = (
    messageIndex: number,
    field: FieldPath<TBotMessage>,
    newData: any,
  ) => {
    setValue(`messages.${messageIndex}.${field}`, newData);
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
            handleMessageChange={handleMessageChange}
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
  handleMessageChange,
}: {
  index: number;
  message: TBotMessage;
  control: Control<TMessageActionForm>;
  onRemove: (index: number) => void;
  handleMessageChange: (
    messageIndex: number,
    field: FieldPath<TBotMessage>,
    newData: any,
  ) => void;
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
                variant="destructive"
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
              handleMessageChange={handleMessageChange}
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
  handleMessageChange,
}: {
  index: number;
  message: TBotMessage;
  control: Control<TMessageActionForm>;
  handleMessageChange: (
    messageIndex: number,
    field: FieldPath<TBotMessage>,
    newData: any,
  ) => void;
}) => {
  const updatedProps = {
    index,
    message,
    control,
    handleMessageChange,
  };

  const componentMap: Record<
    TBotMessage['type'],
    React.ComponentType<typeof updatedProps>
  > = {
    text: FacebookTextMessage,
    card: FacebookCardsMessage,
    quickReplies: FacebookQuickRepliesMessage,
    input: FacebookInputMessage,
  };

  const MessageComponent = componentMap[message.type];

  return MessageComponent ? <MessageComponent {...updatedProps} /> : null;
};
