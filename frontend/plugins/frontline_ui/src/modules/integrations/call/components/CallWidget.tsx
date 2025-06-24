import * as PopoverPrimitive from '@radix-ui/react-popover';
import {
  IconDots,
  IconGridDots,
  IconMicrophoneFilled,
  IconMinus,
  IconPhoneFilled,
  IconPhonePause,
} from '@tabler/icons-react';
import { Button, Separator } from 'erxes-ui';
import { CustomersInline } from 'ui-modules';
import {
  CallWidgetDraggableRoot,
  DraggableHandle,
} from '@/integrations/call/components/CallWidgetDraggable';

// Static customer data to prevent recreating array
const MOCK_CUSTOMERS = [
  {
    _id: '',
    firstName: 'John',
    lastName: 'Doe',
    avatar: '',
  },
];

export const CallWidgetContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="flex items-center gap-1 pl-3 pr-1.5 text-sm h-10">
        <span>⭐ Office number</span>
        <span className="text-muted-foreground">0:05</span>
        <Button variant="secondary" size="icon" className="ml-auto">
          <IconMinus />
        </Button>
        {children}
      </div>
      <Separator />
      <div className="px-3 py-5">
        <CustomersInline.Provider customers={MOCK_CUSTOMERS}>
          <div className="flex items-center gap-2">
            <CustomersInline.Avatar size="xl" />
            <CustomersInline.Title />
          </div>
        </CustomersInline.Provider>
      </div>
      <Separator />
      <div className="flex items-end gap-4 justify-between p-3">
        <Button
          variant="secondary"
          size="icon"
          className="bg-success size-9 hover:bg-success/80 [&_svg]:size-5 text-primary-foreground"
        >
          <IconMicrophoneFilled />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="text-xs text-destructive size-9 relative bg-muted"
          >
            <div className="absolute top-1.5 left-2 size-2 bg-destructive rounded-full" />
            <div className="span mt-2">rec</div>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="size-9 bg-muted [&_svg]:size-5"
          >
            <IconGridDots />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="size-9 bg-muted [&_svg]:size-5"
          >
            <IconPhonePause />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="size-9 bg-muted [&_svg]:size-5 ml-auto"
          >
            <IconDots />
          </Button>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="bg-destructive size-9 hover:bg-destructive/80 text-primary-foreground"
        >
          <IconPhoneFilled className="rotate-[135deg]" strokeWidth={1} />
        </Button>
      </div>
    </>
  );
};

export const CallWidget = () => {
  return (
    <PopoverPrimitive.Root open>
      <CallWidgetDraggableRoot>
        <PopoverPrimitive.Content
          side="top"
          align="end"
          sideOffset={0}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          className="z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 w-96 rounded-lg min-w-[--radix-popper-anchor-width] bg-background text-foreground shadow-focus"
        >
          <CallWidgetContent>
            <DraggableHandle />
          </CallWidgetContent>
        </PopoverPrimitive.Content>
      </CallWidgetDraggableRoot>
    </PopoverPrimitive.Root>
  );
};
