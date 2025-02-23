import { useMessengerMessages } from '../hooks/useMessengerMessages';
import { IMessengerMessage } from '@/inbox/types/Conversation';
import { MessengerMessage } from './MessengerMessage';
import { ScrollArea, Skeleton } from 'erxes-ui/components';
import { useEffect, useRef } from 'react';
import { useQueryState } from '../../hooks/useQueryState';
import React from 'react';

export const MessengerMessages = () => {
  const [conversationId] = useQueryState<string>('conversationId');
  const viewportRef = useRef<HTMLDivElement>(null);
  const distanceFromBottomRef = useRef(0);

  const { messages, loading, handleFetchMore } = useMessengerMessages({
    variables: {
      conversationId,
      limit: 5,
      skip: 0,
    },
    onCompleted: () => scrollToBottom(),
  });

  const messageIsDownloaded = !!messages?.length;

  const scrollToBottom = () => {
    setTimeout(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
    });
  };

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
          {messages?.map((message: IMessengerMessage, index: number) => (
            <MessengerMessage
              key={message._id}
              {...message}
              previousMessage={messages[index - 1]}
              nextMessage={messages[index + 1]}
            />
          ))}
        </div>
        {(loading || !messages?.length) && <MessagesSkeleton />}
      </ScrollArea.Viewport>
      <ScrollArea.Bar orientation="vertical" />
      <ScrollArea.Bar orientation="horizontal" />
    </ScrollArea.Root>
  );
};

const MessagesSkeleton = () => {
  return (
    <div className="absolute inset-0 bg-background">
      <div className="flex flex-col max-w-[648px] mx-auto p-6">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-7 w-36" />
              </div>
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-32 ml-auto" />
              <div className="inline-flex items-center gap-2 justify-end">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-7 w-36" />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
