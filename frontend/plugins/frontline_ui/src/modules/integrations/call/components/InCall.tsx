import { sipStateAtom } from '@/integrations/call/states/sipStates';
import { CallStatusEnum } from '@/integrations/call/types/sipTypes';
import {
  IconDialpad,
  IconFileText,
  IconMicrophone,
  IconPhoneOutgoing,
  IconUser,
} from '@tabler/icons-react';
import { Button, ButtonProps, cn, Label } from 'erxes-ui';
import { Toggle } from '@radix-ui/react-toggle';
import { useAtom, useAtomValue } from 'jotai';
import React from 'react';
import { inCallViewAtom } from '@/integrations/call/states/callStates';
import { SelectMember } from 'ui-modules';
import { useSip } from '@/integrations/call/components/SipProvider';

export const InCall = ({ children }: { children: React.ReactNode }) => {
  const { stopCall } = useSip();

  return (
    <>
      <div className="text-center">{children}</div>
      <div className="text-center space-y-2 p-2 pb-6">
        <CallStatus />
        <CallNumber />
      </div>
      <Transfer />
      <div className="grid grid-cols-5 p-1 gap-1 items-stretch border-b-0">
        <Mute />
        <TransferTrigger />
        <Detail />
        <Keypad />
        <SelectCustomer />
      </div>
      <div className="px-3 pb-6">
        <Button
          className="w-full bg-destructive/10 text-destructive hover:bg-destructive/15"
          variant="secondary"
          onClick={stopCall}
        >
          End Call
        </Button>
      </div>
    </>
  );
};

export const InCallActionButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        'flex-col h-auto text-accent-foreground hover:text-foreground font-medium [&>svg]:size-5 gap-1 rounded-lg justify-start text-wrap px-1 text-xs',
        className,
      )}
      {...props}
    />
  );
});

export const Mute = () => {
  return (
    <InCallActionButton>
      <IconMicrophone />
      Mute
    </InCallActionButton>
  );
};

export const TransferTrigger = () => {
  const [inCallView, setInCallView] = useAtom(inCallViewAtom);
  return (
    <InCallActionButton
      asChild
      className="data-[state=on]:bg-muted data-[state=on]:text-foreground"
    >
      <Toggle
        pressed={inCallView === 'transfer'}
        onPressedChange={(pressed) =>
          setInCallView(pressed ? 'transfer' : null)
        }
      >
        <IconPhoneOutgoing />
        Transfer
      </Toggle>
    </InCallActionButton>
  );
};
export const Transfer = () => {
  const inCallView = useAtomValue(inCallViewAtom);

  if (inCallView !== 'transfer') {
    return null;
  }

  return (
    <div className="space-y-3 px-3 pb-3">
      <div className="space-y-2">
        <Label>Transfer to</Label>
        <SelectMember />
      </div>
      <div className="flex flex-col gap-1">
        <Button variant="secondary">Transfer</Button>
        <Button variant="ghost" className="text-accent-foreground">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export const Detail = () => {
  return (
    <InCallActionButton>
      <IconFileText />
      Detail
    </InCallActionButton>
  );
};

export const Keypad = () => {
  return (
    <InCallActionButton>
      <IconDialpad />
      Keypad
    </InCallActionButton>
  );
};

export const SelectCustomer = () => {
  return (
    <InCallActionButton>
      <IconUser />
      Select <br /> Customer
    </InCallActionButton>
  );
};

const CallStatus = () => {
  const sip = useAtomValue(sipStateAtom);

  return (
    <div className="text-accent-foreground text-sm text-center font-medium">
      {sip.callStatus}
      {sip.callStatus === CallStatusEnum.STARTING && 'Calling...'}
      {sip.callStatus === CallStatusEnum.ACTIVE && 'In call'}
    </div>
  );
};

const CallNumber = () => {
  return (
    <div className="text-lg font-semibold text-primary text-center">
      8089 1582
    </div>
  );
};
