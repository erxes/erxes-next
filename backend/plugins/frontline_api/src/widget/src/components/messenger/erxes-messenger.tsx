import { IconMessage2 } from '@tabler/icons-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Button } from '../ui/button';
import { Header } from '../messenger/header';
import { useMessenger } from '../messenger/hooks/useMessenger';
import { CreateTicket } from '../messenger/create-ticket';
import {
  ConversationMessage,
  OperatorMessage,
} from '../messenger/conversation';
import { DateSeparator } from '../messenger/date-seperator';
import { CustomerMessage } from '../messenger/conversation';
import { ChatInput } from '../messenger/chat-input';
import { useEnabledServices } from '@/components/messenger/hooks/useEnabledServices';
import { useConnect } from '@/components/messenger/hooks/useConnect';

interface MessengerProps {
  brandId?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ErxesMessenger = ({
  brandId: _brandId,
  isOpen: controlledOpen,
  onOpenChange,
}: MessengerProps) => {
  console.log('ErxesMessenger rendered with brandId:', _brandId);
  const { activeTab, isOpen, setIsOpen } = useMessenger();
  const { enabledServices, loading, error } = useEnabledServices();
  const {
    result,
    loading: isConnecting,
    error: connectError,
  } = useConnect({ brandId: _brandId ?? '' });
  console.log(
    'enabledServices',
    enabledServices,
    'loading:',
    loading,
    'error:',
    error,
  );
  const open = controlledOpen ?? isOpen;
  const handleOpenChange = onOpenChange ?? setIsOpen;

  console.log(
    'result',
    result,
    'isConnecting:',
    isConnecting,
    'connectError:',
    connectError,
  );

  console.log('Popover state:', { open, controlledOpen, isOpen, _brandId });

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
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="fixed bottom-4 right-4 z-50 size-12 flex items-center justify-center rounded-full shadow-xs shadow-accent"
        >
          <IconMessage2 size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={16}
        className="max-w-[var(--widget-width)] min-w-96 w-full bg-sidebar"
      >
        <Header />
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
};
