import { Resizable } from 'erxes-ui/components';
import { useQueryState } from '../hooks/useQueryState';

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
  const [showDetailView] = useQueryState('detailView');

  return (
    <Resizable.PanelGroup
      direction="horizontal"
      className="flex-1 overflow-hidden"
    >
      <Resizable.Panel minSize={20} defaultSize={30}>
        {showDetailView ? conversations : mainFilters}
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel minSize={20} defaultSize={70}>
        {conversationId || showDetailView ? conversationDetail : conversations}
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
