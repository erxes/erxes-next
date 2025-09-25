import { useState } from 'react';
import { ErxesMessengerPopover } from './erxes-messenger-popover';
import { IconX } from '@tabler/icons-react';
import { Header } from './Header';
import { Body } from './Body';

export const ErxesMessenger = () => {
  const [open, setOpen] = useState(false);
  return (
    <ErxesMessengerPopover.Root open={open} onOpenChange={setOpen}>
      <ErxesMessengerPopover.Trigger>
        <span className="text-lg font-bold text-primary transition-transform duration-500">
          {open ? (
            <IconX size={24} />
          ) : (
            <img
              src="assets/erxes.png"
              alt="Erxes Messenger"
              className="w-6 h-6 object-contain"
            />
          )}
        </span>
      </ErxesMessengerPopover.Trigger>
      <ErxesMessengerPopover.Content>
        <ErxesMessengerPopover.Header>
          <Header />
        </ErxesMessengerPopover.Header>
        <Body />
      </ErxesMessengerPopover.Content>
    </ErxesMessengerPopover.Root>
  );
};
