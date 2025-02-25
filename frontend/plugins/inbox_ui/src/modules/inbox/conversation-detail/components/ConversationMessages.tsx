import { ScrollArea } from 'erxes-ui';
import { useQueryState } from '../../hooks/useQueryState';
import { useEffect, useRef } from 'react';
import { ConversationMessage } from './ConverstaionMessage';
import { IMessage } from '../../types/Conversation';
import { MessagesSkeleton } from './ConversationSkeleton';
import { useConversationMessages } from '../hooks/useConversationMessages';

export const ConversationMessages = () => {
  const [conversationId] = useQueryState<string>('conversationId');
  const viewportRef = useRef<HTMLDivElement>(null);
  const distanceFromBottomRef = useRef(0);

  const { messages, loading, handleFetchMore } = useConversationMessages({
    variables: {
      conversationId,
      limit: 5,
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

  const onScroll = () => {
    if (viewportRef.current && viewportRef.current.scrollTop === 0) {
      distanceFromBottomRef.current =
        viewportRef.current.scrollHeight - viewportRef.current.scrollTop;
      handleFetchMore();
    }
  };

  useEffect(() => {
    if (distanceFromBottomRef.current && viewportRef.current) {
      viewportRef.current.scrollTop =
        viewportRef.current.scrollHeight - distanceFromBottomRef.current;
    }
  }, [messages]);

  useEffect(() => {
    if (messageIsDownloaded) {
      scrollToBottom();
    }
  }, [messageIsDownloaded, conversationId]);

  return (
    <ScrollArea.Root className="h-full">
      <ScrollArea.Viewport ref={viewportRef} onScroll={onScroll}>
        <div className="flex flex-col w-[648px] mx-auto p-6">
          {messages?.map((message: IMessage, index: number) => (
            <ConversationMessage
              key={message._id}
              {...message}
              previousMessage={messages[index - 1]}
              nextMessage={messages[index + 1]}
            />
          ))}
        </div>
        <MessagesSkeleton isFetched={!loading && !!messages?.length} />
      </ScrollArea.Viewport>
      <ScrollArea.Bar orientation="vertical" />
      <ScrollArea.Bar orientation="horizontal" />
    </ScrollArea.Root>
  );
};
