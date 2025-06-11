import { Spinner, Toggle } from 'erxes-ui';
import { useChangeConversationStatus } from '@/inbox/conversations/hooks/useChangeConversationStatus';
import { useConversationContext } from '@/inbox/conversations/hooks/useConversationContext';
import { ConversationStatus } from '@/inbox/types/Conversation';

export const ConversationActions = () => {
  const { changeConversationStatus, loading } = useChangeConversationStatus();
  const { _id, status } = useConversationContext();

  const resolveConversation = () => {
    changeConversationStatus({
      variables: {
        ids: [_id],
        status: ConversationStatus.CLOSED,
      },
    });
  };

  return (
    <Toggle
      variant="outline"
      className="flex-none"
      pressed={status === ConversationStatus.CLOSED}
      onPressedChange={resolveConversation}
      disabled={loading}
    >
      {loading && <Spinner size="small" />}
      {loading
        ? 'Resolving'
        : status === ConversationStatus.CLOSED
        ? 'Open'
        : 'Resolve'}
    </Toggle>
  );

  // return (
  //   <DropdownMenu>
  //     <DropdownMenu.Trigger asChild>
  //       <Button className="flex-none pr-2" variant="outline">
  //         Actions <IconChevronDown className="w-4 h-4" />
  //       </Button>
  //     </DropdownMenu.Trigger>
  //     <DropdownMenu.Content>
  //       <DropdownMenu.Item>Resolve</DropdownMenu.Item>
  //     </DropdownMenu.Content>
  //   </DropdownMenu>
  // );
};
