import { ScrollArea, Separator, Skeleton, toast } from 'erxes-ui';
import { CustomerInline, SelectMember, SelectTags } from 'ui-modules';

import { useConversationContext } from '@/inbox/conversations/hooks/useConversationContext';
import { useAssignConversations } from '@/inbox/conversations/hooks/useAssignConversations';
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
              className="text-sm text-foreground flex-none"
              avatarProps={{ size: 'lg' }}
            />
          ) : (
            <Skeleton className="w-32 h-4 ml-2" />
          )}
          <Separator.Inline />
          <AssignConversation />
          <Separator.Inline />
          <Tags />
        </div>
        <ScrollArea.Bar orientation="horizontal" />
      </ScrollArea>
      <ConversationActions />
    </div>
  );
};

const AssignConversation = () => {
  const { assignedUserId, _id } = useConversationContext();
  const { assignConversations } = useAssignConversations();

  const handleAssignConversations = (value: string | string[]) => {
    assignConversations({
      variables: {
        conversationIds: [_id],
        assignedUserId: value,
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      Assigned to:
      <SelectMember.Detail
        value={assignedUserId}
        onValueChange={handleAssignConversations}
        className="text-foreground"
        variant="outline"
      />
    </div>
  );
};

const Tags = () => {
  const { _id, tagIds } = useConversationContext();

  return (
    <SelectTags.Detail
      tagType="frontline:conversation"
      className="flex-none w-auto"
      variant="ghost"
      value={tagIds}
      targetIds={[_id]}
    />
  );
};
