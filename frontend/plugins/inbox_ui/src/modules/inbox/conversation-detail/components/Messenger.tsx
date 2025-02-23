import { Resizable } from 'erxes-ui/components';
import { MessengerMessages } from './MessengerMessages';
import { MessageInput } from './MessageInput';
export const Messenger = () => {
  return (
    <Resizable.PanelGroup direction="vertical">
      <Resizable.Panel defaultSize={70}>
        <MessengerMessages />
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={30} className="py-4">
        <MessageInput />
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
