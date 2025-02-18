import { useChannels } from '@/channels/hooks/useChannels';
import { Collapsible, Skeleton } from 'erxes-ui/components';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';

export const ChooseChannel = () => {
  const currentUser = useAtomValue(currentUserState);
  console.log(currentUser, currentUserState);
  const { channels, loading } = useChannels({
    variables: {
      memberIds: [currentUser?._id],
    },
  });

  if (loading) return <Skeleton className="w-32 h-4" />;

  if (channels?.length === 0) return null;

  return (
    <Collapsible className="group/channel">
      <Collapsible.TriggerButton>
        <Collapsible.TriggerIcon className="group-data-[state=open]/channel:rotate-180" />
        Channels
      </Collapsible.TriggerButton>
      <Collapsible.Content className="pl-4 flex flex-col gap-1">
        {channels?.map((channel: any) => (
          <div key={channel.id}>{channel.name}</div>
        ))}
      </Collapsible.Content>
    </Collapsible>
  );
};
