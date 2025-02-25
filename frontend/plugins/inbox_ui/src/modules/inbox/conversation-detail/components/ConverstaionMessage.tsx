import { cn } from 'erxes-ui/lib/utils';
import { IMessage } from '../../types/Conversation';
import { HAS_ATTACHMENT } from '../../constants/messengerConstants';
import { FormDisplay } from './FormDisplay';
import { Button, IAttachment, RelativeDateDisplay } from 'erxes-ui';
import { MessageContent } from './MessageContent';

export const ConversationMessage = ({
  previousMessage,
  nextMessage,
  ...message
}: IMessage & {
  previousMessage?: IMessage;
  nextMessage?: IMessage;
}) => {
  const {
    _id,
    userId,
    content,
    createdAt,
    customerId,
    attachments,
    formWidgetData,
    internalNote,
  } = message;

  if (formWidgetData) return <FormDisplay {...message} />;

  const checkHasSibling = (message?: IMessage) => {
    if (!message) {
      return false;
    }

    const isClient = !userId;

    if (isClient) {
      return message.customerId === customerId;
    }

    return message.userId === userId;
  };

  const hasPreviousMessage = checkHasSibling(previousMessage);
  const hasNextMessage = checkHasSibling(nextMessage);

  return (
    <div
      className={cn('max-w-[428px]', userId ? 'ml-auto' : 'mr-auto ')}
      key={_id}
    >
      {content !== HAS_ATTACHMENT ? (
        <Button
          variant="secondary"
          className={cn(
            'mt-2 h-auto py-2 text-left [&_*]:whitespace-pre-wrap block font-normal space-y-2 overflow-x-hidden text-pretty break-words [&_a]:text-primary [&_a]:underline [&_img]:aspect-square [&_img]:object-cover [&_img]:rounded',
            userId && 'bg-primary/10 hover:bg-primary/10',
            internalNote &&
              'bg-yellow-50 hover:bg-yellow-50 dark:bg-yellow-950 dark:hover:bg-yellow-950',
            !hasPreviousMessage && 'mt-6',
          )}
          asChild
        >
          <div>
            <MessageContent content={content} />
            {!hasNextMessage && (
              <div className="text-muted-foreground mt-1">
                <RelativeDateDisplay value={createdAt} />
              </div>
            )}
          </div>
        </Button>
      ) : (
        <div className={cn(hasPreviousMessage ? 'mt-2' : 'mt-6')} />
      )}
      <Attachments attachments={attachments} />
    </div>
  );
};

const Attachments = ({ attachments }: { attachments?: IAttachment[] }) => {
  if (!attachments) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid grid-cols-3 gap-2',
        attachments.length === 1 && 'grid-cols-2',
      )}
    >
      {attachments.map((attachment) => (
        <Attachment key={attachment.url} attachment={attachment} />
      ))}
    </div>
  );
};

const Attachment = ({ attachment }: { attachment: IAttachment }) => {
  return (
    <img
      src={attachment.url}
      alt={attachment.name}
      className="w-full aspect-square object-cover rounded bg-accent"
    />
  );
};
