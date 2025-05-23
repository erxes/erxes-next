import { ScrollArea } from 'erxes-ui';
import { useQueryState } from '../../hooks/useQueryState';
import { useEffect, useRef } from 'react';
import { ConversationMessage } from './ConverstaionMessage';
import { IMessage } from '../../types/Conversation';
import { MessagesSkeleton } from './ConversationSkeleton';
import { useConversationMessages } from '../hooks/useConversationMessages';
import { useInView } from 'react-intersection-observer';
import { ConversationMessageContext } from '../../context/ConversationMessageContext';

export const ConversationMessages = () => {
  const [conversationId] = useQueryState<string>('conversationId');
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fetchMoreRef] = useInView({
    threshold: 0,
    onChange(inView) {
      if (inView && viewportRef.current) {
        distanceFromBottomRef.current =
          viewportRef.current.scrollHeight - viewportRef.current.scrollTop;
        handleFetchMore();
      }
    },
  });
  const distanceFromBottomRef = useRef(0);

  const { messages, loading, handleFetchMore, totalCount } =
    useConversationMessages({
      variables: {
        conversationId,
        limit: 10,
        skip: 0,
      },
      onCompleted: () => scrollToBottom(),
    });

  const scrollToBottom = () => {
    setTimeout(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
    });
  };

  const messageIsDownloaded = !!messages?.length;

  useEffect(() => {
    if (viewportRef.current) {
      if (distanceFromBottomRef.current) {
        viewportRef.current.scrollTop =
          viewportRef.current.scrollHeight - distanceFromBottomRef.current;
        distanceFromBottomRef.current = 0;
      } else {
        scrollToBottom();
      }
    }
  }, [messages]);

  useEffect(() => {
    if (messageIsDownloaded) {
      scrollToBottom();
    }
  }, [messageIsDownloaded, conversationId]);

  return (
    <ScrollArea.Root className="h-full">
      <ScrollArea.Viewport ref={viewportRef}>
        {messages && totalCount > messages.length && <p ref={fetchMoreRef} />}
        <div className="flex flex-col w-[648px] mx-auto p-6">
          {messages?.map((message: IMessage, index: number) => (
            <ConversationMessageContext.Provider
              value={{
                ...message,
                previousMessage: messages[index - 1],
                nextMessage: messages[index + 1],
              }}
              key={message._id}
            >
              <ConversationMessage />
            </ConversationMessageContext.Provider>
          ))}
        </div>
        <MessagesSkeleton isFetched={!loading && !!messages?.length} />
      </ScrollArea.Viewport>
      <ScrollArea.Bar orientation="vertical" />
      <ScrollArea.Bar orientation="horizontal" />
    </ScrollArea.Root>
  );
};
