import {
  Button,
  cn,
  Combobox,
  Command,
  Popover,
  Skeleton,
  TextOverflowTooltip,
  Tooltip,
} from 'erxes-ui';
import React, { useState } from 'react';
import { useMultipleSelectChannelContext } from '../hooks/useMultipleSelectChannelContext';
import { IChannel } from '../types/Channel';
import { MultipleSelectChannelContext } from '../contexts/MultipleSelectChannelContext';
import { useChannelById } from '../hooks/useChannelById';
import { useChannels } from '../hooks/useChannels';
import { IconX } from '@tabler/icons-react';

type Props = {
  value?: string[];
  onValueChange: (value: any) => void;
};

type ProvideProps = {
  children: React.ReactNode;
};

type SelectItemProps = {
  channel: IChannel;
  onValueChange: (value: string[]) => void;
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
          <MultipleSelectChannelsValue onValueChange={onValueChange} />
        </Combobox.Trigger>
        <Combobox.Content>
          <ChannelList
            renderItem={(channel) => (
              <SelectChannelItem
                key={channel._id}
                channel={channel}
                onValueChange={(value) => {
                  onValueChange(value);
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
    string[] | undefined
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

  const isSelected = selectedChannels && selectedChannels.includes(channel._id);
  const handleSelect = () => {
    if (isSelected) {
      setSelectedChannels(
        selectedChannels.filter(
          (selectedChannel) => selectedChannel !== channel._id,
        ),
      );
    } else {
      setSelectedChannels(
        selectedChannels ? [...selectedChannels, channel._id] : [channel._id],
      );
    }
    onValueChange(
      selectedChannels ? [...selectedChannels, channel._id] : [channel._id],
    );
  };
  return (
    <Command.Item value={channel.name} onSelect={handleSelect}>
      <TextOverflowTooltip value={channel.name} />
      <Combobox.Check checked={isSelected} />
    </Command.Item>
  );
};

const MultipleSelectChannelsValue = ({
  onValueChange,
}: {
  onValueChange: (value: string[]) => void;
}) => {
  const { selectedChannels, setSelectedChannels } =
    useMultipleSelectChannelContext();

  const { channels, loading } = useChannels();

  if (loading) return <Skeleton className="h-4 w-32 overflow-hidden" />;

  const selected =
    (selectedChannels &&
      channels
        ?.slice()
        ?.sort(
          (a, b) =>
            (selectedChannels ?? []).indexOf(a._id) -
            (selectedChannels ?? []).indexOf(b._id),
        )
        .filter((channel) => selectedChannels?.includes(channel._id))) ||
    [];

  const handleRemove = (id: string) => {
    const newList =
      (selectedChannels && selectedChannels?.filter((item) => item !== id)) ||
      [];
    setSelectedChannels(newList);
    onValueChange(newList);
  };

  if (selectedChannels && selectedChannels?.length > 1) {
    return (
      <div className="flex gap-1">
        {selected?.splice(0, 1).map((item: IChannel) => (
          <div
            key={item._id}
            className="w-auto text-xs flex items-center gap-2 max-w-24 bg-primary/10 px-2 rounded-md"
          >
            <Combobox.Value value={item.name} />
            <Button
              variant={'ghost'}
              className=" h-3 w-3 p-1 rounded-full"
              onClick={() => handleRemove(item?._id)}
            >
              <IconX size={8} />
            </Button>
          </div>
        ))}
        <Tooltip>
          <Tooltip.Trigger asChild>
            <div className="w-auto px-1 h-4 text-xs flex items-center justify-center rounded-full bg-primary/10">
              +{selectedChannels.length - 1}
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content className="flex flex-col">
            {selected?.splice(0, selected.length).map((item: IChannel) => (
              <Combobox.Value
                key={item._id}
                className="w-auto max-w-24 bg-primary/10 px-2 rounded-md"
                value={item.name}
              />
            ))}
          </Tooltip.Content>
        </Tooltip>
      </div>
    );
  }

  return (
    <>
      <Combobox.Value
        className={cn(
          selected.length > 0 &&
            'w-auto max-w-24 bg-primary/10 px-2 rounded-md',
        )}
        value={selected[0]?.name}
        placeholder="Select Channels"
      />
      {selected && selected.length > 0 && (
        <Button
          variant={'ghost'}
          className="h-3 w-3 p-1 rounded-full"
          onClick={() => handleRemove(selected[0]?._id)}
        >
          <IconX size={8} />
        </Button>
      )}
    </>
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
      <Command.Input placeholder="Search unit" />
      <Command.List>
        <Combobox.Empty loading={loading} />
        {channels?.map((channel: IChannel) => renderItem(channel))}
      </Command.List>
    </Command>
  );
};
