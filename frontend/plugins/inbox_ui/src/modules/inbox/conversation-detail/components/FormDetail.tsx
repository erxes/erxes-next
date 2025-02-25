import { useQueryState } from '../../hooks/useQueryState';
import { useFormWidgetData } from '../hooks/useFormWidgetData';
import { ScrollArea, Skeleton } from 'erxes-ui';
import { IMessage } from '../../types/Conversation';
import React from 'react';
import { FormDisplay } from './FormDisplay';
import { InternalNoteDisplay } from 'ui-modules';
import { MessageInput } from './MessageInput';
import { ConversationDetailLayout } from './ConversationDetailLayout';

export const FormDetailMessages = () => {
  const [conversationId] = useQueryState('conversationId');

  const { conversationMessages, loading } = useFormWidgetData({
    variables: { conversationId, limit: 10 },
  });

  if (loading) {
    return <Skeleton className="h-full" />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto w-[648px] p-6 flex flex-col gap-6">
        {conversationMessages.map((message: IMessage) => (
          <React.Fragment key={message._id}>
            {message.formWidgetData && <FormDisplay {...message} />}
            {message.internalNote && (
              <InternalNoteDisplay content={message.content} />
            )}
          </React.Fragment>
        ))}
      </div>
      <ScrollArea.Bar orientation="horizontal" />
    </ScrollArea>
  );
};

export const FormDetail = () => {
  return (
    <ConversationDetailLayout input={<MessageInput />}>
      <FormDetailMessages />
    </ConversationDetailLayout>
  );
};
