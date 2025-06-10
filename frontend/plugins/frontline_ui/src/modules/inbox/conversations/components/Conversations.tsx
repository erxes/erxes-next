import { useInView } from 'react-intersection-observer';
import { IconLoader } from '@tabler/icons-react';

import { ConversationContext } from '@/inbox/conversations/context/ConversationContext';
import { ConversationListContext } from '@/inbox/conversations/context/ConversationListContext';
import { IConversation } from '@/inbox/types/Conversation';
import { useConversations } from '~/modules/inbox/conversations/hooks/useConversations';

import {
  Button,
  EnumCursorDirection,
  EnumCursorMode,
  parseDateRangeFromString,
  Separator,
  useNonNullMultiQueryState,
} from 'erxes-ui';

import { ConversationsHeader } from '@/inbox/conversations/components/ConversationsHeader';
import { ConversationFilter } from './ConversationFilter';
import { FilterTags } from './FilterTags';
import { CONVERSATIONS_LIMIT } from '@/inbox/constants/conversationsConstants';
import { ConversationItem } from './ConversationItem';

export const Conversations = () => {
  const [ref] = useInView({
    onChange(inView) {
      if (inView) {
        handleFetchMore({
          direction: EnumCursorDirection.FORWARD,
        });
      }
    },
  });
  const { channelId, integrationKind, unassigned, status, date } =
    useNonNullMultiQueryState<{
      channelId: string;
      integrationKind: string;
      unassigned: string;
      status: string;
      date: string;
      conversationId: string;
    }>([
      'channelId',
      'integrationKind',
      'unassigned',
      'status',
      'date',
      'conversationId',
    ]);

  const parsedDate = parseDateRangeFromString(date || '');

  const { totalCount, conversations, handleFetchMore, loading, pageInfo } =
    useConversations({
      variables: {
        limit: CONVERSATIONS_LIMIT,
        channelId,
        integrationType: integrationKind,
        unassigned,
        status: status || 'closed',
        startDate: parsedDate?.from,
        endDate: parsedDate?.to,
        cursorMode: EnumCursorMode.INCLUSIVE,
      },
    });

  return (
    <ConversationListContext.Provider
      value={{
        conversations,
        loading,
        totalCount,
      }}
    >
      <div className="flex flex-col h-full overflow-hidden w-full">
        <ConversationsHeader>
          <ConversationFilter />
          <FilterTags />
        </ConversationsHeader>
        <Separator />
        <div className="h-full w-full overflow-y-auto">
          {conversations?.map((conversation: IConversation) => (
            <ConversationContext.Provider
              key={conversation._id}
              value={conversation}
            >
              <ConversationItem />
            </ConversationContext.Provider>
          ))}
          {!loading && conversations?.length > 0 && pageInfo?.hasNextPage && (
            <Button
              variant="ghost"
              ref={ref}
              className="pl-6 h-8 w-full text-muted-foreground"
              asChild
            >
              <div>
                <IconLoader className="size-4 animate-spin" />
                loading more...
              </div>
            </Button>
          )}
        </div>
      </div>
    </ConversationListContext.Provider>
  );
};
