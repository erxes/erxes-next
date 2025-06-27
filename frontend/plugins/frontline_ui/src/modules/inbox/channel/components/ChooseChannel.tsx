import { useChannelsByMembers } from '@/inbox/channel/hooks/useChannels';
import { Button, Collapsible, Skeleton, TextOverflowTooltip } from 'erxes-ui';
import { useAtom } from 'jotai';
import { IChannel } from '@/inbox/types/Channel';
import { useMultiQueryState } from 'erxes-ui';
import { IconCheck } from '@tabler/icons-react';
import { channelCollapsibleState } from '@/inbox/channel/states/channelCollapsibleState';

export const ChooseChannel = () => {
  const [open, setOpen] = useAtom(channelCollapsibleState);

  return (
    <Collapsible className="group/channel" open={open} onOpenChange={setOpen}>
      <Collapsible.TriggerButton>
        <Collapsible.TriggerIcon className="group-data-[state=open]/channel:rotate-180" />
        Channels
      </Collapsible.TriggerButton>
      <Collapsible.Content className=" flex flex-col gap-1 py-1 pl-1">
        <ChooseChannelContent open={open} />
      </Collapsible.Content>
    </Collapsible>
  );
};

const ChooseChannelContent = ({ open }: { open: boolean }) => {
  const { channels, loading } = useChannelsByMembers({
    skip: !open,
  });

  if (loading)
    return (
      <>
        <Skeleton className="w-32 h-4 mt-1" />
        <Skeleton className="w-36 h-4 mt-1" />
        <Skeleton className="w-32 h-4 mt-1" />
      </>
    );

  if (!channels?.length)
    return (
      <div className="text-sm text-accent-foreground ml-3 my-4">
        No channels found
      </div>
    );

  return channels?.map((channel: IChannel) => (
    <ChannelItem key={channel._id} {...channel} />
  ));
};

const ChannelItem = ({ _id, name }: IChannel) => {
  const [{ channelId }, setValues] = useMultiQueryState<{
    channelId: string;
    detailView: boolean;
  }>(['channelId', 'detailView']);

  const isActive = channelId === _id;

  const handleClick = () =>
    setValues({
      channelId: _id,
      detailView: true,
    });

  return (
    <Button
      key={_id}
      variant={isActive ? 'secondary' : 'ghost'}
      className="w-full justify-start pl-7 relative text-left"
      onClick={handleClick}
    >
      {isActive && <IconCheck className="absolute left-1.5" />}
      <TextOverflowTooltip value={name} />
      <span className="ml-auto text-xs text-accent-foreground">0</span>
    </Button>
  );
};
