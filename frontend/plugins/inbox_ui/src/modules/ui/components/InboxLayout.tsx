import { Resizable } from 'erxes-ui/components';
import { InboxSidebar } from './InboxSidebar';

export const InboxLayout = () => {
  return (
    <Resizable.PanelGroup
      direction="horizontal"
      className="flex-1 overflow-hidden"
    >
      <Resizable.Panel defaultSize={30} maxSize={60}>
        <InboxSidebar />
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={70} maxSize={80}>
        <div>Right</div>
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
