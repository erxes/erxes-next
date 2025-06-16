import { Button, cn, Skeleton } from 'erxes-ui';
import { useConversationListContext } from '../hooks/useConversationListContext';
import { useAtom } from 'jotai';
import { selectMainFilterState } from '@/inbox/states/inboxLayoutState';
import { IconArrowLeft, IconUserFilled } from '@tabler/icons-react';

export const ConversationsHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSelectMainFilter, setIsSelectMainFilter] = useAtom(
    selectMainFilterState,
  );

  if (isSelectMainFilter) {
    return (
      <div className="pl-6 pr-4 py-3">
        <Button
          variant="ghost"
          className="text-muted-foreground w-full justify-start mb-5 px-2"
          onClick={() => setIsSelectMainFilter(false)}
        >
          <IconArrowLeft />
          Back to menu
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-1 px-2">
          <IconUserFilled />
          Team Inbox
          <ConversationCount />
        </Button>
        {children}
      </div>
    );
  }
  return (
    <div className="pl-4 pr-4 py-3">
      {children} <ConversationCount className="ml-4 text-sm font-medium" />
    </div>
  );
};

export const ConversationCount = ({ className }: { className?: string }) => {
  const { totalCount, loading } = useConversationListContext();
  return (
    <span
      className={cn(
        'text-muted-foreground ml-auto inline-flex items-center gap-1',
        className,
      )}
    >
      {loading ? <Skeleton className="w-4 h-4" /> : totalCount} conversations
    </span>
  );
};
