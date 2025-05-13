import {
  Avatar,
  cn,
  Combobox,
  Command,
  Popover,
  TextOverflowTooltip,
} from 'erxes-ui';
import React, { useState } from 'react';
import { useMultipleSelectChannelContext } from '../hooks/useMultipleSelectChannelContext';
import { IChannel } from '../types/Channel';
import { MultipleSelectChannelContext } from '../contexts/MultipleSelectChannelContext';
import { useChannels } from '../hooks/useChannels';

type Props = {
  value?: string[];
  onValueChange: (value: string[]) => void;
};

type ProvideProps = {
  children: React.ReactNode;
};

type SelectItemProps = {
  channel: IChannel;
  onValueChange: (value: IChannel[]) => void;
};

export const MultipleSelectChannels = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & Props
>(({ value, onValueChange, ...props }, ref) => {
  const [_open, _setOpen] = useState(false);
  return (
    <MultipleSelectChannelsProvider>
      <Popover open={_open} onOpenChange={_setOpen}>
        <Combobox.Trigger
          {...props}
          ref={ref}
          className={cn('w-full flex text-left', props.className)}
        >
          <MultipleSelectChannelsValue />
        </Combobox.Trigger>
        <Combobox.Content>
          <ChannelList
            renderItem={(channel) => (
              <SelectChannelItem
                key={channel._id}
                channel={channel}
                onValueChange={(updatedChannels) => {
                  const channelIds = updatedChannels.map((c) => c._id);
                  onValueChange(channelIds);
                  _setOpen(false);
                }}
              />
            )}
          />
        </Combobox.Content>
      </Popover>
    </MultipleSelectChannelsProvider>
  );
});

const MultipleSelectChannelsProvider = ({ children }: ProvideProps) => {
  const [selectedChannels, setSelectedChannels] = useState<
    IChannel[] | undefined
  >(undefined);
  return (
    <MultipleSelectChannelContext.Provider
      value={{ selectedChannels, setSelectedChannels }}
    >
      {children}
    </MultipleSelectChannelContext.Provider>
  );
};

const SelectChannelItem = ({ channel, onValueChange }: SelectItemProps) => {
  const { selectedChannels, setSelectedChannels } =
    useMultipleSelectChannelContext();

  const isSelected = selectedChannels?.some((chan) =>
    chan._id?.includes(channel._id),
  );
  const handleSelect = () => {
    let newSelectedChannels: IChannel[];

    if (isSelected) {
      newSelectedChannels =
        selectedChannels?.filter(
          (selectedChannel) => selectedChannel._id !== channel._id,
        ) || [];
    } else {
      newSelectedChannels = selectedChannels
        ? [...selectedChannels, channel]
        : [channel];
    }

    setSelectedChannels(newSelectedChannels);
    onValueChange(newSelectedChannels);
  };

  return (
    <Command.Item value={channel.name} onSelect={handleSelect}>
      <TextOverflowTooltip value={channel.name} />
      <Combobox.Check checked={isSelected} />
    </Command.Item>
  );
};

const MultipleSelectChannelsValue = () => {
  const { selectedChannels } = useMultipleSelectChannelContext();

  const displayValue =
    selectedChannels && selectedChannels?.length > 0
      ? selectedChannels?.length === 1
        ? selectedChannels[0]?.name
        : `${selectedChannels?.length} channels`
      : undefined;

  return (
    <span className="inline-flex items-center gap-2 overflow-hidden">
      <InlineAvatars />
      <Combobox.Value value={displayValue} placeholder="Select channels" />
    </span>
  );
};

export const ChannelList = ({
  renderItem,
}: {
  renderItem: (channel: IChannel) => React.ReactNode;
}) => {
  const { channels, loading } = useChannels();
  return (
    <Command>
      <Command.Input placeholder="Search channel" />
      <Command.List>
        <Combobox.Empty loading={loading} />
        {channels?.map((channel: IChannel) => renderItem(channel))}
      </Command.List>
    </Command>
  );
};

const InlineAvatars = () => {
  const { selectedChannels } = useMultipleSelectChannelContext();

  if (!selectedChannels || selectedChannels.length === 0) {
    return null;
  }
  const withAvatar = selectedChannels?.slice(
    0,
    selectedChannels?.length > 2 ? 1 : 2,
  );

  return (
    <div className="flex -space-x-1.5">
      {withAvatar?.map((channel) => (
        <Avatar
          size="lg"
          className="ring-2 ring-background bg-background"
          key={channel._id}
        >
          <Avatar.Fallback>{channel?.name.charAt(0)}</Avatar.Fallback>
        </Avatar>
      ))}
      {selectedChannels?.length - withAvatar?.length > 0 && (
        <Avatar size="lg" className="ring-2 ring-background bg-background">
          <Avatar.Fallback className="bg-primary/10 text-primary">
            +{selectedChannels?.length - withAvatar?.length}
          </Avatar.Fallback>
        </Avatar>
      )}
    </div>
  );
};
