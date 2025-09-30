import { Popover } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { IconMessage2 } from '@tabler/icons-react';
import { Header } from './header';
import { useMessenger } from './hooks/useMessenger';
import { CreateTicket } from './create-ticket';
import { ConversationMessage, OperatorMessage } from './conversation';
import { DateSeparator } from './date-seperator';
import { CustomerMessage } from './conversation';
import { ChatInput } from './chat-input';
import { MessengerProps } from './types';

export const ErxesMessenger = ({
  isOpen: controlledOpen,
  onOpenChange,
}: Omit<MessengerProps, 'brandId'>) => {
  const { activeTab, isOpen, setIsOpen } = useMessenger();

  const open = controlledOpen ?? isOpen;
  const handleOpenChange = onOpenChange ?? setIsOpen;

  const renderContent = () => {
    switch (activeTab) {
      case 'ticket':
        return <CreateTicket />;
      case 'chat':
        return (
          <div className="flex flex-col">
            <div className="flex flex-auto flex-col justify-end gap-2 p-4">
              <OperatorMessage />
              <DateSeparator date="Today" />
              <CustomerMessage />
            </div>
            <ChatInput />
          </div>
        );
      default:
        return (
          <div className="flex flex-col">
            <div className="flex flex-col justify-center p-4 font-medium text-sm min-h-28">
              <ConversationMessage />
            </div>
            <ChatInput />
          </div>
        );
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild className='fixed bottom-4 right-4 z-50'>
        <Button size="icon">
          <IconMessage2 />
        </Button>
      </Popover.Trigger>
      <Popover.Content side="top">
        <Header />
        {renderContent()}
      </Popover.Content>
    </Popover>
  );
};
