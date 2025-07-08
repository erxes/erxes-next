import * as PopoverPrimitive from '@radix-ui/react-popover';
import {
  IconArrowsMaximize,
  IconDots,
  IconGridDots,
  IconMicrophoneFilled,
  IconMinus,
  IconPhoneFilled,
  IconPhonePause,
} from '@tabler/icons-react';
import { Button, DropdownMenu, Separator } from 'erxes-ui';
import { CustomersInline } from 'ui-modules';
import {
  CallWidgetDraggableRoot,
  DraggableHandle,
} from '@/integrations/call/components/CallWidgetDraggable';
import { useAtom, useSetAtom } from 'jotai';
import {
  callWidgetPositionState,
  expandWidgetState,
  showNumbersState,
} from '@/integrations/call/states/callWidgetStates';
import { CallNumberInput } from '@/integrations/call/components/CallNumberInput';
import { CSSProperties, useLayoutEffect, useRef, useState } from 'react';

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
  const [expandWidget, setExpandWidget] = useAtom(expandWidgetState);

  return (
    <div className="flex items-stretch overflow-hidden flex-1">
      <div className="flex-1 min-w-72 flex flex-col h-(radix-popper-content-height)">
        <div className="flex items-center gap-1 pl-3 pr-1.5 text-sm h-10 flex-none">
          <span>⭐ Office number</span>
          <span className="text-muted-foreground">0:05</span>
          <Button
            variant="secondary"
            size="icon"
            className="ml-auto"
            onClick={() => setExpandWidget((prev) => !prev)}
          >
            {expandWidget ? <IconMinus /> : <IconArrowsMaximize />}
          </Button>
          {children}
        </div>
        {expandWidget && (
          <>
            <Separator />
            <div className="px-3 py-5 flex-auto h-full">
              <CustomersInline.Provider customers={MOCK_CUSTOMERS}>
                <div className="flex items-center gap-2">
                  <CustomersInline.Avatar size="xl" />
                  <CustomersInline.Title />
                </div>
              </CustomersInline.Provider>
            </div>
            <Separator />
            <div className="flex items-end gap-4 justify-between p-2">
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
                  <div className="mt-2">rec</div>
                </Button>
                <ShowNumbers />
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-9 bg-muted [&_svg]:size-5"
                >
                  <IconPhonePause />
                </Button>
                <CallWidgetMoreActions />
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
        )}
      </div>
      {expandWidget && <CallNumberInput />}
    </div>
  );
};

export const CallWidgetMoreActions = () => {
  const setPositionState = useSetAtom(callWidgetPositionState);
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="size-9 bg-muted [&_svg]:size-5 ml-auto"
        >
          <IconDots />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Call history</DropdownMenu.Item>
        <DropdownMenu.Item>Settings</DropdownMenu.Item>
        <DropdownMenu.Item>Hide</DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => setPositionState({ x: 0, y: 0 })}>
          Reset position
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export const ShowNumbers = () => {
  const setShowNumbersState = useSetAtom(showNumbersState);

  return (
    <Button
      variant="secondary"
      size="icon"
      className="size-9 bg-muted [&_svg]:size-5"
      onClick={() => setShowNumbersState((prev) => !prev)}
    >
      <IconGridDots />
    </Button>
  );
};

export const CallWidget = () => {
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>();

  useLayoutEffect(() => {
    if (popoverContentRef.current) {
      setContentHeight(popoverContentRef.current.offsetHeight);
    }
  }, []);

  return (
    <PopoverPrimitive.Root open>
      <CallWidgetDraggableRoot>
        <PopoverPrimitive.Content
          side="top"
          align="end"
          avoidCollisions={false}
          sideOffset={0}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          ref={popoverContentRef}
          style={
            {
              '--radix-popper-content-height': contentHeight,
            } as CSSProperties
          }
          className="z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 rounded-lg min-w-[--radix-popper-anchor-width] bg-background text-foreground shadow-focus"
        >
          <CallWidgetContent>
            <DraggableHandle />
          </CallWidgetContent>
        </PopoverPrimitive.Content>
      </CallWidgetDraggableRoot>
    </PopoverPrimitive.Root>
  );
};
