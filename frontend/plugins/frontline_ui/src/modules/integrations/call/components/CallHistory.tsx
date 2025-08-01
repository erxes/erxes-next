import { useCallHistories } from '@/integrations/call/hooks/useCallHistories';
import { callUiAtom } from '@/integrations/call/states/callUiAtom';
import { callNumberState } from '@/integrations/call/states/callWidgetStates';
import { IconPhoneOutgoing, IconPhoneX } from '@tabler/icons-react';
import { format } from 'date-fns';
import {
  Tabs,
  Command,
  Input,
  Separator,
  formatPhoneNumber,
  cn,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';

export const CallHistory = () => {
  return (
    <Tabs defaultValue="all">
      <Tabs.List className="grid grid-cols-2 px-2">
        <Tabs.Trigger value="all">All calls (15)</Tabs.Trigger>
        <Tabs.Trigger value="missed">Missed calls</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="all" className="h-96">
        <CallHistoryList missed={false} />
      </Tabs.Content>
      <Tabs.Content value="missed" className="h-96">
        <CallHistoryList missed={true} />
      </Tabs.Content>
    </Tabs>
  );
};

export const CallHistoryList = ({ missed = false }: { missed?: boolean }) => {
  const { callHistories } = useCallHistories(missed);
  const setCallUi = useSetAtom(callUiAtom);
  const setPhone = useSetAtom(callNumberState);

  return (
    <Command>
      <div className="p-3">
        <Command.Input asChild wrapperClassName="border-b-0" className="h-7">
          <Input />
        </Command.Input>
      </div>
      <Separator />
      <Command.List className="p-3 flex-auto max-h-full">
        <Command.Empty />
        {callHistories?.map((callHistory) => (
          <Command.Item
            className="h-7 p-2 font-medium"
            value={callHistory._id + '|' + callHistory.customerPhone}
            onSelect={() => {
              setCallUi('keypad');
              setPhone(callHistory.customerPhone);
            }}
          >
            {callHistory.callStatus === 'cancelled' ? (
              <IconPhoneX className="text-destructive" />
            ) : (
              <IconPhoneOutgoing className="text-accent-foreground" />
            )}
            <span
              className={cn(
                callHistory.callStatus === 'cancelled' && 'text-destructive',
              )}
            >
              {formatPhoneNumber({ value: callHistory.customerPhone })}
            </span>
            <span className="ml-auto text-accent-foreground">
              {format(new Date(callHistory.callStartTime), 'MMM, dd, HH:mm')}
            </span>
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
};
