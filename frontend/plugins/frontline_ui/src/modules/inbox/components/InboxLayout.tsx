import { Resizable, useQueryState } from 'erxes-ui';
import { useAtomValue } from 'jotai';
import {
  inboxLayoutState,
  showConversationsState,
} from '../states/inboxLayoutState';

export const InboxLayout = ({
  conversations,
  mainFilters,
  conversationDetail,
}: {
  conversations: React.ReactNode;
  mainFilters: React.ReactNode;
  conversationDetail: React.ReactNode;
}) => {
  const [conversationId] = useQueryState<string>('conversationId');
  const inboxLayout = useAtomValue(inboxLayoutState);
  const showConversations = useAtomValue(showConversationsState);

  return (
    <Resizable.PanelGroup
      direction="horizontal"
      className="flex-1 overflow-hidden"
    >
      <Resizable.Panel minSize={20} maxSize={35} defaultSize={30}>
        {inboxLayout === 'list'
          ? mainFilters
          : showConversations
          ? conversations
          : mainFilters}
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel minSize={20} defaultSize={70}>
        {inboxLayout === 'split'
          ? conversationDetail
          : conversationId
          ? conversationDetail
          : conversations}
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
