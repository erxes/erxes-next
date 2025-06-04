import { IChannel } from '@/inbox/types/Channel';
import {
  SelectChannelContext,
  useSelectChannelContext,
} from '@/inbox/channel/context/SelectChannelContext';
import { useState } from 'react';
import { ChannelsInline } from './ChannelsInline';
import { useDebounce } from 'use-debounce';
import { cn, Combobox, Command, Form, Popover } from 'erxes-ui';
import { useChannels } from '../hooks/useChannels';

const SelectChannelProvider = ({
  children,
  mode = 'single',
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  mode?: 'single' | 'multiple';
  value?: string[] | string;
  onValueChange?: (value: string[] | string) => void;
}) => {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const isSingleMode = mode === 'single';

  const onSelect = (channel: IChannel) => {
    if (!channel) {
      return;
    }

    if (isSingleMode) {
      setChannels([channel]);
      return onValueChange?.(channel._id);
    }
    const arrayValue = Array.isArray(value) ? value : [];

    const isChannelSelected = arrayValue.includes(channel._id);
    const newSelectedChannelIds = isChannelSelected
      ? arrayValue.filter((id) => id !== channel._id)
      : [...arrayValue, channel._id];

    setChannels(channels.filter((c) => newSelectedChannelIds.includes(c._id)));
    onValueChange?.(newSelectedChannelIds);
  };

  return (
    <SelectChannelContext.Provider
      value={{
        channels,
        setChannels,
        channelIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectChannelContext.Provider>
  );
};

const SelectChannelsValue = () => {
  const { channels, channelIds, setChannels } = useSelectChannelContext();

  return (
    <ChannelsInline
      channels={channels}
      channelIds={channelIds}
      updateChannels={setChannels}
    />
  );
};

export const SelectChannelsContent = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { channelIds, onSelect } = useSelectChannelContext();
  const {
    channels: channelsData,
    loading,
    error,
    handleFetchMore,
  } = useChannels({
    variables: {
      searchValue: debouncedSearch,
    },
  });

  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        variant="secondary"
        wrapperClassName="flex-auto"
        focusOnMount
      />
      <Command.List className="max-h-[300px] overflow-y-auto">
        <Combobox.Empty loading={loading} error={error} />
        {channelsData && channelsData?.length > 0 && (
          <>
            {channelsData.map((channel) => (
              <Command.Item
                value={channel._id}
                onSelect={() => {
                  onSelect(channel);
                }}
              >
                {channel.name}
                <Combobox.Check checked={channelIds.includes(channel._id)} />
              </Command.Item>
            ))}
            <Command.Separator className="my-1" />

            <Combobox.FetchMore
              fetchMore={handleFetchMore}
              currentLength={channelsData.length}
              totalCount={channelsData.length + 1}
            />
          </>
        )}
      </Command.List>
    </Command>
  );
};

export const SelectChannelsFormItem = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectChannelProvider>, 'children'> & {
  className?: string;
}) => {
  return (
    <SelectChannelProvider {...props}>
      <Popover>
        <Form.Control>
          <Popover.Trigger asChild>
            <Combobox.Trigger className={cn('w-full', className)}>
              <SelectChannelsValue />
            </Combobox.Trigger>
          </Popover.Trigger>
        </Form.Control>

        <Combobox.Content>
          <SelectChannelsContent />
        </Combobox.Content>
      </Popover>
    </SelectChannelProvider>
  );
};

export const SelectChannel = {
  Provider: SelectChannelProvider,
  Value: SelectChannelsValue,
  Content: SelectChannelsContent,
  FormItem: SelectChannelsFormItem,
};
