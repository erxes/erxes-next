import { ScrollArea, Separator, Skeleton } from 'erxes-ui/components';
import { AssignMember, CustomerInline } from 'ui-modules';
import { useConversationContext } from '../../hooks/useConversationContext';
import { useAssignConversations } from '../hooks/useAssignConversations';

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
  const { assignedUserId } = useConversationContext();
  const { assignConversations, loading } = useAssignConversations();
  return (
    <AssignMember
      value={assignedUserId}
      size="lg"
      variant="secondary"
      className="min-w-32 text-foreground -ml-1"
    />
  );
};
