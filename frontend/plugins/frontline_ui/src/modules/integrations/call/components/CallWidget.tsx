import * as PopoverPrimitive from '@radix-ui/react-popover';
import { IconArrowsMaximize, IconDots, IconMinus } from '@tabler/icons-react';
import { Button, DropdownMenu, Separator } from 'erxes-ui';
import { CustomersInline } from 'ui-modules';
import {
  CallWidgetDraggableRoot,
  DraggableHandle,
} from '@/integrations/call/components/CallWidgetDraggable';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  callWidgetPositionState,
  expandWidgetState,
} from '@/integrations/call/states/callWidgetStates';
import { CallNumberInput } from '@/integrations/call/components/CallNumberInput';
import { CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import {
  CallDirectionEnum,
  CallStatusEnum,
  ISipState,
} from '@/integrations/call/types/sipTypes';
import {
  callInfoAtom,
  sipStateAtom,
} from '@/integrations/call/states/sipStates';
import { CallDisconnected } from '@/integrations/call/components/CallDisconnected';
import { CallTabs } from '@/integrations/call/components/CallTabs';
import { callWidgetOpenAtom } from '@/integrations/call/states/callWidgetOpenAtom';
import { InCall } from '@/integrations/call/components/InCall';
import { IncomingCall } from '@/integrations/call/components/IncomingCall';

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
  const [sipState] = useAtom<ISipState>(sipStateAtom);
  const callInfo = useAtomValue(callInfoAtom);

  if (callInfo?.isUnregistered) {
    return <CallDisconnected>{children}</CallDisconnected>;
  }

  if (sipState.callStatus === CallStatusEnum.IDLE) {
    return <CallTabs>{children}</CallTabs>;
  }

  if (sipState.callDirection === CallDirectionEnum.INCOMING) {
    return <IncomingCall>{children}</IncomingCall>;
  }

  return <InCall>{children}</InCall>;
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

export const CallWidget = () => {
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>();
  const [open, setOpen] = useAtom(callWidgetOpenAtom);

  useLayoutEffect(() => {
    if (popoverContentRef.current) {
      setContentHeight(popoverContentRef.current.offsetHeight);
    }
  }, []);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <CallWidgetDraggableRoot>
        <PopoverPrimitive.Content
          side="top"
          align="end"
          sideOffset={12}
          avoidCollisions={false}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          ref={popoverContentRef}
          style={
            {
              '--radix-popper-content-height': contentHeight,
            } as CSSProperties
          }
          className="z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 rounded-lg bg-background text-foreground shadow-lg min-w-80"
        >
          <CallWidgetContent>
            <DraggableHandle />
          </CallWidgetContent>
        </PopoverPrimitive.Content>
      </CallWidgetDraggableRoot>
    </PopoverPrimitive.Root>
  );
};
