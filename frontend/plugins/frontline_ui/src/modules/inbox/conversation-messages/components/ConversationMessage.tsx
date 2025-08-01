import { cn } from 'erxes-ui';
import { HAS_ATTACHMENT } from '../../constants/messengerConstants';
import { ConversationFormDisplay } from './ConversationFormDisplay';
import { Button, IAttachment, RelativeDateDisplay } from 'erxes-ui';
import { MessageContent } from './MessageContent';
import { useConversationMessageContext } from '../../conversations/conversation-detail/hooks/useConversationMessageContext';
import { CustomersInline, MembersInline } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { activeConversationState } from '../../conversations/states/activeConversationState';

export const ConversationMessage = () => {
  const { previousMessage, nextMessage, ...message } =
    useConversationMessageContext();
  const {
    _id,
    userId,
    content,
    createdAt,
    attachments,
    formWidgetData,
    internal,
    separatePrevious,
    separateNext,
  } = message;

  if (formWidgetData)
    return (
      <MessageWrapper>
        <ConversationFormDisplay {...message} />
      </MessageWrapper>
    );

  return (
    <MessageWrapper>
      <div className={cn('max-w-[428px]')} key={_id}>
        {content !== HAS_ATTACHMENT ? (
          <Button
            variant="secondary"
            className={cn(
              'mt-2 h-auto py-2 text-left [&_*]:whitespace-pre-wrap block font-normal space-y-2 overflow-x-hidden text-pretty break-words [&_a]:text-primary [&_a]:underline [&_img]:aspect-square [&_img]:object-cover [&_img]:rounded',
              userId && 'bg-primary/10 hover:bg-primary/10',
              internal &&
                'bg-yellow-50 hover:bg-yellow-50 dark:bg-yellow-950 dark:hover:bg-yellow-950',
              separatePrevious && 'mt-8',
            )}
            asChild
          >
            <div>
              <MessageContent content={content} internal={internal} />
              {separateNext && (
                <div className="text-muted-foreground mt-1">
                  <RelativeDateDisplay value={createdAt} />
                </div>
              )}
            </div>
          </Button>
        ) : (
          <div className={cn(separatePrevious ? 'mt-2' : 'mt-8')} />
        )}
        <Attachments attachments={attachments} />
      </div>
    </MessageWrapper>
  );
};

export const MessageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { separateNext, customerId, userId, formWidgetData } =
    useConversationMessageContext();
  const { customer } = useAtomValue(activeConversationState) || {};
  return (
    <div
      className={cn(
        'flex items-end w-full gap-3',
        userId ? 'justify-end' : 'justify-start',
        !separateNext && 'px-11',
        !customerId && 'pl-11',
        !userId && 'pr-11',
        formWidgetData && 'pb-4',
      )}
    >
      {!!customerId && separateNext && (
        <CustomersInline.Provider
          customerIds={[customerId]}
          customers={customer ? [customer] : []}
        >
          <CustomersInline.Avatar size="xl" />
        </CustomersInline.Provider>
      )}
      {children}

      {!!userId && separateNext && (
        <MembersInline.Provider memberIds={[userId]}>
          <MembersInline.Avatar size="xl" />
        </MembersInline.Provider>
      )}
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
      className="w-full aspect-square object-cover rounded"
    />
  );
};
