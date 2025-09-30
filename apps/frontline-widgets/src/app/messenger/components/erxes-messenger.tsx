import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Header } from './Header';
import { Body } from './Body';
import { Popover } from 'erxes-ui';

export const ErxesMessenger = () => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="fixed bottom-10 right-10 rounded-full shadow-xs shadow-foreground w-12 h-12 flex items-center justify-center">
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
      </Popover.Trigger>
      <Popover.Content
        sideOffset={12}
        align="end"
        side='top'
        className="sm:max-w-md w-[calc(100vw-theme(spacing.8))] p-0 max-h-[32rem] h-dvh flex flex-col overflow-hidden shadow-xl rounded-lg"
      >
        <Header />
        <Body />
      </Popover.Content>
    </Popover>
  );
};
