import { Button, cn, Skeleton } from 'erxes-ui';
import { useConversationListContext } from '../hooks/useConversationListContext';
import { useAtom } from 'jotai';
import { selectMainFilterState } from '@/inbox/states/inboxLayoutState';
import { IconArrowLeft, IconUserFilled } from '@tabler/icons-react';
import { ConversationFilterBar } from '@/inbox/conversations/components/Filter';

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
      <div className="pl-6 pr-4 py-3 space-y-1">
        <Button
          variant="ghost"
          className="text-muted-foreground w-full justify-start mb-4 px-2"
          onClick={() => setIsSelectMainFilter(false)}
        >
          <IconArrowLeft />
          Back to menu
        </Button>
        <Button variant="ghost" className="w-full justify-start px-2">
          <IconUserFilled />
          <div className="mr-auto">Team Inbox</div>
          <ConversationCount />
        </Button>
        {children}
        <ConversationFilterBar />
      </div>
    );
  }
  return (
    <div className="pl-4 pr-4 py-3 flex">
      {children}{' '}
      <ConversationFilterBar>
        <ConversationCount />
      </ConversationFilterBar>
    </div>
  );
};

export const ConversationCount = ({ className }: { className?: string }) => {
  const { totalCount, loading } = useConversationListContext();
  return (
    <span
      className={cn(
        'text-muted-foreground inline-flex items-center gap-1 ml-2 text-sm font-medium',
        className,
      )}
    >
      {loading ? <Skeleton className="w-4 h-4" /> : totalCount} conversations
    </span>
  );
};
