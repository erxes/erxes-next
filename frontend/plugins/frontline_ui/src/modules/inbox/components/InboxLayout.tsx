import { inboxLayoutState } from '@/inbox/states/inboxLayoutState';
import { Resizable, useQueryState } from 'erxes-ui';
import { useAtomValue } from 'jotai';

export const InboxLayout = ({
  conversations,
  conversationDetail,
}: {
  conversations: React.ReactNode;
  conversationDetail: React.ReactNode;
}) => {
  const inboxLayout = useAtomValue(inboxLayoutState);
  const [conversationId] = useQueryState('conversationId');

  if (inboxLayout === 'list') {
    return conversationId ? conversationDetail : conversations;
  }

  return (
    <Resizable.PanelGroup
      direction="horizontal"
      className="flex-1 overflow-hidden"
    >
      <Resizable.Panel minSize={20} maxSize={35} defaultSize={30}>
        {conversations}
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel minSize={20} defaultSize={70}>
        {conversationDetail}
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
