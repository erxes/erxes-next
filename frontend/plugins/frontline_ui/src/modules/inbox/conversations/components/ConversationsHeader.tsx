import { Button, cn, Skeleton } from 'erxes-ui';
import { useConversationListContext } from '../hooks/useConversationListContext';
import { useAtom, useAtomValue } from 'jotai';
import {
  inboxLayoutState,
  selectMainFilterState,
} from '@/inbox/states/inboxLayoutState';
import { IconArrowLeft, IconUserFilled } from '@tabler/icons-react';
import { ConversationFilterBar } from '@/inbox/conversations/components/ConversationsFilter';

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
          Team Inbox
          <ConversationCount />
        </Button>
        {children}
        <ConversationFilterBar />
      </div>
    );
  }
  return (
    <div className="px-4 py-3 flex">
      {children}
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
        'text-muted-foreground inline-flex items-center gap-1 ml-2 text-sm font-medium ml-auto',

        className,
      )}
    >
      {loading ? <Skeleton className="w-4 h-4" /> : totalCount} conversations
    </span>
  );
};
