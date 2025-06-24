import { Combobox, Command, Filter } from 'erxes-ui';
import { InboxHotkeyScope } from '@/inbox/types/InboxHotkeyScope';
import {
  IconCalendarPlus,
  IconCheck,
  IconCheckbox,
  IconLoader,
  IconSquare,
  IconUsersGroup,
  IconUserX,
} from '@tabler/icons-react';
import { SelectMember } from 'ui-modules';
import { useQueryState } from 'erxes-ui';
import { SelectChannel } from '@/inbox/channel/components/SelectChannel';
import { ConversationStatus } from '@/inbox/types/Conversation';

export const FilterConversations = () => {
  const [status, setStatus] = useQueryState<ConversationStatus>('status');
  const [unassigned, setUnassigned] = useQueryState<boolean>('unassigned');
  const [awaitingResponse, setAwaitingResponse] =
    useQueryState<boolean>('awaitingResponse');
  const [participated, setParticipated] =
    useQueryState<boolean>('participated');

  return (
    <Filter.Popover scope={InboxHotkeyScope.MainPage}>
      <Filter.Trigger isFiltered />
      <Combobox.Content className="w-64">
        <Filter.View>
          <Command>
            <Filter.CommandInput
              placeholder="Filter"
              variant="secondary"
              className="bg-background"
            />
            <Command.List>
              <Filter.CommandItem onSelect={() => setStatus(null)}>
                <IconSquare />
                Unresolved
                {status === null && <IconCheck className="ml-auto" />}
              </Filter.CommandItem>
              <Filter.CommandItem
                onSelect={() => setStatus(ConversationStatus.CLOSED)}
              >
                <IconCheckbox />
                Resolved
                {status === ConversationStatus.CLOSED && (
                  <IconCheck className="ml-auto" />
                )}
              </Filter.CommandItem>
              <Command.Separator className="my-1" />
              <SelectMember.FilterItem />
              <Filter.CommandItem
                onSelect={() => setUnassigned(unassigned ? null : true)}
              >
                <IconUserX />
                Unassigned
                {unassigned && <IconCheck className="ml-auto" />}
              </Filter.CommandItem>
              <Filter.CommandItem
                onSelect={() =>
                  setAwaitingResponse(awaitingResponse ? null : true)
                }
              >
                <IconLoader />
                Awaiting response
                {awaitingResponse && <IconCheck className="ml-auto" />}
              </Filter.CommandItem>
              <Filter.CommandItem
                onSelect={() => setParticipated(participated ? null : true)}
              >
                <IconUsersGroup />
                Participated
                {participated && <IconCheck className="ml-auto" />}
              </Filter.CommandItem>
              <Command.Separator className="my-1" />
              <SelectChannel.FilterItem />
              <Command.Separator className="my-1" />
              <Filter.Item value="created">
                <IconCalendarPlus />
                Created At
              </Filter.Item>
            </Command.List>
          </Command>
        </Filter.View>
        <SelectMember.FilterView onValueChange={() => setUnassigned(null)} />
        <SelectChannel.FilterView />
        <Filter.View filterKey="created">
          <Filter.DateView filterKey="created" />
        </Filter.View>
      </Combobox.Content>
    </Filter.Popover>
  );
};

export const ConversationFilterBar = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [status] = useQueryState<ConversationStatus>('status');
  const [unassigned, setUnassigned] = useQueryState<boolean>('unassigned');
  const [awaitingResponse] = useQueryState<boolean>('awaitingResponse');
  const [participated] = useQueryState<boolean>('participated');
  const [created] = useQueryState<Date>('created');

  return (
    <Filter.Bar className="pl-2 mt-2">
      <Filter.Dialog>
        <Filter.DialogDateView filterKey="created" />
      </Filter.Dialog>
      <SelectMember.FilterBar
        iconOnly
        onValueChange={() => setUnassigned(null)}
      />
      {status === ConversationStatus.CLOSED && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconCheckbox />
            Resolved
          </Filter.BarName>
          <Filter.BarClose filterKey="status" />
        </Filter.BarItem>
      )}
      {created && (
        <Filter.BarItem>
          <Filter.Date filterKey="created" className="rounded-l" />
          <Filter.BarClose filterKey="created" />
        </Filter.BarItem>
      )}
      {unassigned && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconUserX />
            Unassigned
          </Filter.BarName>
          <Filter.BarClose filterKey="unassigned" />
        </Filter.BarItem>
      )}
      {awaitingResponse && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconLoader />
            Awaiting response
          </Filter.BarName>
          <Filter.BarClose filterKey="awaitingResponse" />
        </Filter.BarItem>
      )}
      {participated && (
        <Filter.BarItem>
          <Filter.BarName>
            <IconUsersGroup />
            Participated
          </Filter.BarName>
          <Filter.BarClose filterKey="participated" />
        </Filter.BarItem>
      )}
      <SelectChannel.FilterBar />
      {children}
    </Filter.Bar>
  );
};
