import { useAtomValue } from 'jotai';
import { Button, IAttachment, RelativeDateDisplay, cn } from 'erxes-ui';
import { CustomersInline, MembersInline } from 'ui-modules';

import { HAS_ATTACHMENT } from '@/inbox/constants/messengerConstants';
import { ConversationFormDisplay } from '@/inbox/conversation-messages/components/ConversationFormDisplay';
import { MessageContent } from '@/inbox/conversation-messages/components/MessageContent';
import { useConversationMessageContext } from '@/inbox/conversations/conversation-detail/hooks/useConversationMessageContext';
import { activeConversationState } from '@/inbox/conversations/states/activeConversationState';

export const MessageItem = () => {
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
                  <RelativeDateDisplay value={createdAt}>
                    <RelativeDateDisplay.Value value={createdAt} />
                  </RelativeDateDisplay>
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
      {attachments.map((attachment, index) => (
        <Attachment
          key={`${attachment.url}-${index}`}
          attachment={attachment}
        />
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
