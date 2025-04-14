import { ScrollArea, Separator, Skeleton } from 'erxes-ui/components';
import {
  AssignMember,
  CustomerInline,
  SelectTags,
  useGiveTags,
} from 'ui-modules';
import { useConversationContext } from '../../hooks/useConversationContext';
import { useAssignConversations } from '../hooks/useAssignConversations';
import { toast } from 'erxes-ui/hooks';
import { useState } from 'react';
import { ConversationActions } from './ConversationActions';

export const ConversationHeader = () => {
  const { customer, customerId, loading } = useConversationContext();
  return (
    <div className="flex gap-6 items-center h-12 flex-none pr-6">
      <ScrollArea className="flex-auto">
        <div className="h-12 flex items-center px-5 text-xs font-medium text-muted-foreground flex-none gap-3 whitespace-nowrap">
          Customer:
          {!loading ? (
            <CustomerInline
              customerId={customerId}
              customer={customer}
              className="text-sm text-foreground"
              avatarProps={{ size: 'lg' }}
            />
          ) : (
            <Skeleton className="w-32 h-4 ml-2" />
          )}
          <Separator.Inline />
          Assigned to:
          {!loading ? (
            <AssignConversation />
          ) : (
            <Skeleton className="w-32 h-4 ml-2" />
          )}
          <Separator.Inline />
          Tags:
          {!loading ? <Tags /> : <Skeleton className="w-32 h-4 ml-2" />}
        </div>
        <ScrollArea.Bar orientation="horizontal" />
      </ScrollArea>
      <ConversationActions />
    </div>
  );
};

const AssignConversation = () => {
  const { assignedUserId, _id } = useConversationContext();
  const [assigningUser, setAssigningUser] = useState<string | null>(null);
  const { assignConversations, loading } = useAssignConversations({
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <AssignMember
      value={assigningUser || assignedUserId}
      disabled={!!loading}
      onValueChange={(value) => {
        setAssigningUser(value);
        assignConversations({
          variables: {
            conversationIds: [_id],
            assignedUserId: value,
          },
        });
      }}
      size="lg"
      variant="secondary"
      className="min-w-32 h-7 text-foreground -ml-1 flex-none shadow-none w-auto"
    />
  );
};

const Tags = () => {
  const { _id, tagIds } = useConversationContext();
  const { giveTags, loading } = useGiveTags();

  return (
    <SelectTags
      tagType="inbox:conversation"
      recordId={_id}
      className="flex-none w-auto min-w-32 max-w-48 h-7 hover:bg-background"
      selected={tagIds}
      asTrigger
      loading={loading}
      onSelect={(tags) => {
        giveTags({
          variables: {
            targetIds: [_id],
            tagIds: tags,
            type: 'inbox:conversation',
          },
          update: (cache) => {
            cache.modify({
              id: cache.identify({
                __typename: 'Conversation',
                _id,
              }),
              fields: { tagIds: () => tags },
            });
          },
        });
      }}
    />
  );
};
