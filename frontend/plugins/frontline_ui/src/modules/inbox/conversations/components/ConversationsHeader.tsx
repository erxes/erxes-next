import { cn, Skeleton } from 'erxes-ui';
import { useConversationListContext } from '../hooks/useConversationListContext';
import { ConversationFilterBar } from '@/inbox/conversations/components/ConversationsFilter';

export const ConversationsHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="pl-6 pr-4 py-2 space-y-1 bg-sidebar">
      <div className="flex items-center justify-between">
        {children}
        <ConversationCount />
      </div>
      <ConversationFilterBar />
    </div>
  );
};

export const ConversationCount = ({ className }: { className?: string }) => {
  const { totalCount, loading } = useConversationListContext();

  return (
    <span
      className={cn(
        'text-muted-foreground inline-flex items-center gap-1 text-sm font-medium ml-auto',
        className,
      )}
    >
      {loading ? <Skeleton className="w-4 h-4" /> : totalCount} conversations
    </span>
  );
};
