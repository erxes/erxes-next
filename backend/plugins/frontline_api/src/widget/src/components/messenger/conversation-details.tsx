import {
  BotMessage,
  OperatorMessage,
} from '@/components/messenger/conversation';
import { DateSeparator } from './date-seperator';
import { CustomerMessage } from '@/components/messenger/conversation';
import { ChatInput } from '@/components/messenger/chat-input';
import { useConversationDetail } from '@/components/messenger/hooks/useConversationDetail';
import { useAtomValue } from 'jotai';
import {
  connectionAtom,
  conversationIdAtom,
  integrationIdAtom,
} from '@/components/messenger/atoms';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMessageDate, getDateKey } from '@/lib/formatDate';
import { useMemo, useRef } from 'react';
import { BotSeparator } from '@/components/messenger/bot-seperator';
import { cn } from '@/lib/utils';

export const ConversationDetails = () => {
  const conversationId = useAtomValue(conversationIdAtom);
  const integrationId = useAtomValue(integrationIdAtom);
  const connection = useAtomValue(connectionAtom);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data } = connection;
  const { messengerData } = data || {};
  const { botGreetMessage, botShowInitialMessage } = messengerData || {};
  const { conversationDetail, loading } = useConversationDetail({
    variables: {
      _id: conversationId,
      integrationId,
    },
    skip: !conversationId || !integrationId,
  });
  const { messages } = conversationDetail || {};

  // Group messages by date
  const messagesByDate = useMemo(() => {
    if (!messages) return {};

    const grouped: Record<string, typeof messages> = {};

    messages.forEach((message) => {
      const dateKey = getDateKey(message.createdAt);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });

    // Sort messages within each date group by createdAt
    Object.keys(grouped).forEach((dateKey) => {
      grouped[dateKey].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    });

    return grouped;
  }, [messages]);

  // Get sorted date keys for rendering
  const sortedDateKeys = useMemo(() => {
    return Object.keys(messagesByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
  }, [messagesByDate]);

  if (loading) {
    return <Skeleton className="w-full aspect-square" />;
  }

  return (
    <div className="flex flex-col max-h-[calc(var(--widget-max-height)-4rem)] overflow-y-hidden">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-p-0 scroll-m-0 scroll-pt-16 flex flex-col-reverse p-4 space-y-2 scroll-smooth min-h-[20rem]"
      >
        {botShowInitialMessage && <BotMessage content={botGreetMessage} />}

        {sortedDateKeys
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map((dateKey, index) => {
            const messagesForDate = messagesByDate[dateKey];
            const dateLabel = formatMessageDate(dateKey);

            return (
              <div
                key={dateKey}
                className={cn(
                  sortedDateKeys.length - 1 === index && 'snap-end',
                  'space-y-2',
                )}
              >
                <DateSeparator date={dateLabel} />
                {messagesForDate.map((message) => {
                  console.log(`message ${index}`, message);
                  if (message.fromBot) {
                    return (
                      <BotSeparator
                        key={message._id}
                        content={message.content}
                      />
                    );
                  }

                  if (!message.customerId) {
                    return (
                      <OperatorMessage
                        key={message._id}
                        content={message.content}
                        src={
                          message.user?.details?.avatar || 'assets/user.webp'
                        }
                        createdAt={new Date(message.createdAt)}
                      />
                    );
                  }

                  return (
                    <CustomerMessage
                      key={message._id}
                      content={message.content}
                      createdAt={new Date(message.createdAt)}
                    />
                  );
                })}
              </div>
            );
          })}
      </div>
      <div className="flex-shrink-0">
        <ChatInput />
      </div>
    </div>
  );
};
