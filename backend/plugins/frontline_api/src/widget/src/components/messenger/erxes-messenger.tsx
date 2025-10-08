import { Popover, PopoverContent } from '../ui/popover';
import { Header } from '../messenger/header';
import { useMessenger } from '../messenger/hooks/useMessenger';
import { CreateTicket } from '../messenger/create-ticket';
import { useConnect } from '@/components/messenger/hooks/useConnect';
import { Welcome } from '@/components/messenger/Welcome';
import { ConversationDetails } from '@/components/messenger/conversation-details';
import { Tooltip } from '@/components/ui/tooltip';
import { MessengerIcon } from './messenger-icon';
import { BRAND_ID } from '../../../config';

interface MessengerProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ErxesMessenger = ({
  isOpen: controlledOpen,
  onOpenChange,
}: MessengerProps) => {
  const { activeTab, isOpen, setIsOpen } = useMessenger();

  const { loading: connecting } = useConnect({ brandId: BRAND_ID || 'dGt278' });
  const open = controlledOpen ?? isOpen;

  const handleOpenChange = (open: boolean) => {
    if (connecting) return;
    onOpenChange?.(open);
    setIsOpen(open);
  };

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
          className="flex flex-col justify-between sm:max-w-[var(--widget-width)] max-w-screen-sm max-h-svh max-sm:w-dvw max-sm:h-[calc(100dvh-theme(spacing.20))] sm:min-w-96 sm:max-h-[var(--widget-max-height)] sm:min-h-[var(--widget-min-height)] overflow-hidden size-full"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Header />
          <div className="flex-1 flex flex-col justify-end overflow-y-hidden h-full bg-card">
            {renderContent()}
          </div>
        </PopoverContent>
      </Popover>
    </Tooltip.Provider>
  );
};
