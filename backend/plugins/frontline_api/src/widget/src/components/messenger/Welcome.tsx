import { Skeleton } from '@/components/ui/skeleton';
import { useGetMessengerSupporters } from '@/components/messenger/hooks/useGetMessengerSupporters';
import {
  ConversationMessage,
  EmptyChat,
} from '@/components/messenger/conversation';
import { ChatInput } from '@/components/messenger/chat-input';
import { useConversations } from '@/components/messenger/hooks/useConversations';

export const Welcome = () => {
  const { loading: loadingSupporters } = useGetMessengerSupporters();
  const {
    conversations,
    loading: loadingConversations,
    lastMesseges,
  } = useConversations();

  if (loadingSupporters || loadingConversations) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col justify-center p-4 font-medium text-sm min-h-28">
          <div className="flex items-center gap-3">
            <Skeleton className="flex-none size-8 bg-muted rounded-full" />
            <Skeleton className="flex-1 h-10 bg-muted" />
          </div>
        </div>
        <ChatInput />
      </div>
    );
  }
  if (!conversations?.length) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col justify-center p-4 font-medium text-sm min-h-28">
          <EmptyChat />
        </div>
        <ChatInput />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center p-4 font-medium text-sm min-h-28 max-h-60 overflow-y-auto">
        {lastMesseges &&
          lastMesseges?.map((messege, index) => (
            <ConversationMessage
              key={messege?._id}
              conversationId={conversations[index]?._id}
              messege={messege || undefined}
            />
          ))}
      </div>
      <ChatInput />
    </div>
  );
};
