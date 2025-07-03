import { IconSend, IconX } from '@tabler/icons-react';
import { Button, Input, Popover, Separator } from 'erxes-ui';

export const EMPreviewMessages = () => {
  return (
    <>
      <div className="h-12 flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <div>Header</div>
        <Popover.Close asChild>
          <Button size="icon" variant="ghost">
            <IconX />
          </Button>
        </Popover.Close>
      </div>
      <div className="p-4 flex-auto">Content</div>
      <Separator />
      <div className="relative">
        <Input
          placeholder="Send message..."
          className="focus-visible:shadow-none shadow-none h-12 p-4 pr-12"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-2 size-8"
        >
          <IconSend />
        </Button>
      </div>
    </>
  );
};
