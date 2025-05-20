import { IconChalkboard } from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';
import React from 'react';

const ChannelsFilterPopover = () => {
  const [queries] = useMultiQueryState<{
    channelId: string;
  }>(['channelId']);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );

  return (
    <>
      <Filter.Popover scope="channels-filter">
        <Filter.Trigger isFiltered={hasFilters} />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Filter.CommandInput
                placeholder="Filter"
                variant="secondary"
                className="bg-background"
              />
              <Filter.Item value="channelId">
                <IconChalkboard />
                Channel
              </Filter.Item>
            </Command>
          </Filter.View>
        </Combobox.Content>
      </Filter.Popover>
    </>
  );
};

export const ChannelsFilter = () => {
  const [queries] = useMultiQueryState<{
    channelId: string;
  }>(['channelId']);
  const { channelId } = queries || {};
  return (
    <Filter id="channels-filter" sessionKey="">
      <Filter.Bar>
        {channelId && (
          <Filter.BarItem>
            <Filter.BarName>
              <IconChalkboard />
              Channel
            </Filter.BarName>
            <span>Select channel</span>
            <Filter.BarClose filterKey="channelId" />
          </Filter.BarItem>
        )}
        <ChannelsFilterPopover />
      </Filter.Bar>
    </Filter>
  );
};
