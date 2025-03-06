import { ScrollArea, Separator, Skeleton } from 'erxes-ui/components';
import { AssignMember, CustomerInline } from 'ui-modules';
import { useConversationContext } from '../../hooks/useConversationContext';
import { useAssignConversations } from '../hooks/useAssignConversations';
import { toast } from 'erxes-ui/hooks';
import { useState } from 'react';

export const ConversationHeader = () => {
  const { customer, customerId, loading } = useConversationContext();
  return (
    <ScrollArea className="h-12 flex-none">
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
      </div>
      <ScrollArea.Bar orientation="horizontal" />
    </ScrollArea>
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
        variant: 'error',
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
      className="min-w-32 text-foreground -ml-1"
    />
  );
};
