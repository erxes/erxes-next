import { Popover, PopoverContent } from '../ui/popover';
import { Header } from '../messenger/header';
import { useMessenger } from '../messenger/hooks/useMessenger';
import { CreateTicket } from '../messenger/create-ticket';
import { useConnect } from '@/components/messenger/hooks/useConnect';
import { Welcome } from '@/components/messenger/Welcome';
import { useAtomValue } from 'jotai';
import { connectionAtom } from '@/components/messenger/atoms';
import { ConversationDetails } from '@/components/messenger/conversation-details';
import { Tooltip } from '@/components/ui/tooltip';
import { MessengerIcon } from './messenger-icon';

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
  const { activeTab, isOpen, setIsOpen } = useMessenger();

  const { loading: connecting } = useConnect({ brandId: _brandId ?? '' });
  const open = controlledOpen ?? isOpen;

  const handleOpenChange = (open: boolean) => {
    if (connecting) return;
    onOpenChange?.(open);
    setIsOpen(open);
  };

  const connection = useAtomValue(connectionAtom);
  console.log('connection:\n', connection);

  const renderContent = () => {
    switch (activeTab) {
      case 'ticket':
        return <CreateTicket />;
      case 'chat':
        return <ConversationDetails />;
      default:
        return <Welcome />;
    }
  };

  return (
    <Tooltip.Provider>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <MessengerIcon loading={connecting} />
        <PopoverContent
          side="top"
          align="end"
          sideOffset={16}
          className="flex flex-col justify-between max-w-[var(--widget-width)] min-w-96 max-h-[var(--widget-max-height)] min-h-[var(--widget-min-height)] overflow-hidden size-full bg-widget"
        >
          <Header />
          <div className="flex-1 overflow-y-hidden h-full bg-card">
            {renderContent()}
          </div>
        </PopoverContent>
      </Popover>
    </Tooltip.Provider>
  );
};
