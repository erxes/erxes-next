import { Button, ScrollArea, Separator, Skeleton, toast } from 'erxes-ui';
import { CustomersInline, SelectMember, SelectTags } from 'ui-modules';
import { useConversationContext } from '@/inbox/conversations/hooks/useConversationContext';
import { useAssignConversations } from '@/inbox/conversations/hooks/useAssignConversations';
import { ConversationActions } from './ConversationActions';
import { useQueryState } from 'erxes-ui';
import { IconArrowLeft } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { inboxLayoutState } from '@/inbox/states/inboxLayoutState';
import { IntegrationActions } from '@/integrations/components/IntegrationActions';

export const ConversationHeader = () => {
  const { customerId, loading, customer } = useConversationContext();
  const [, setConversationId] = useQueryState<string>('conversationId');
  const view = useAtomValue(inboxLayoutState);

  return (
    <div className="flex gap-6 items-center h-12 flex-none pr-6">
      <ScrollArea className="flex-auto">
        <div className="h-12 flex items-center px-5 text-xs font-medium text-accent-foreground flex-none gap-3 whitespace-nowrap">
          {view === 'list' && (
            <Button
              variant="secondary"
              size="icon"
              className="[&>svg]:size-4 text-foreground"
              onClick={() => setConversationId(null)}
            >
              <IconArrowLeft />
            </Button>
          )}
          {!loading ? (
            <CustomersInline
              customers={customer ? [customer] : []}
              customerIds={customerId ? [customerId] : []}
              className="text-sm text-foreground flex-none"
              placeholder="anonymous customer"
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
      <IntegrationActions />
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
    <div className="flex">
      <SelectMember
        value={assignedUserId}
        onValueChange={handleAssignConversations}
        className="text-foreground shadow-none px-2"
        size="lg"
      />
    </div>
  );
};

const Tags = () => {
  const { _id, tagIds } = useConversationContext();

  return (
    <SelectTags.Detail
      tagType="inbox:conversation"
      className="flex-none w-auto"
      variant="ghost"
      value={tagIds}
      targetIds={[_id]}
    />
  );
};
