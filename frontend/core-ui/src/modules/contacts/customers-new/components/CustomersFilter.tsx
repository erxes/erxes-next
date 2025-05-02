import { useState } from 'react';
import {
  IconCalendar,
  IconCalendarPlus,
  IconCalendarTime,
  IconCalendarUp,
  IconLabel,
  IconSearch,
  IconTags,
} from '@tabler/icons-react';

import {
  Combobox,
  Command,
  Filter,
  Popover,
  useFilterContext,
  useMultiQueryState,
  useQueryState,
} from 'erxes-ui';

import { SelectTags } from 'ui-modules';
import { CustomerTotalCount } from './CustomerTotalCount';

export const SelectTagsFilterView = () => {
  const [tags, setTags] = useQueryState<string[]>('tags');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey="tags">
      <SelectTags
        tagType="core:customer"
        mode="multiple"
        value={tags || []}
        onValueChange={(tags) => {
          setTags(tags as string[]);
          resetFilterState();
        }}
      >
        <SelectTags.Content />
      </SelectTags>
    </Filter.View>
  );
};

export const SelectTagsFilterBar = () => {
  const [tags, setTags] = useQueryState<string[]>('tags');
  const [open, setOpen] = useState(false);

  if (!tags || !tags.length) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconTags />
        Tags
      </Filter.BarName>
      <SelectTags
        tagType="core:customer"
        value={tags}
        mode="multiple"
        onValueChange={(tags) => {
          setTags(tags as string[]);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey="tags">
              <SelectTags.Value />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectTags.Content />
          </Combobox.Content>
        </Popover>
      </SelectTags>
      <Filter.BarClose filterKey="tags" />
    </Filter.BarItem>
  );
};

const CustomersFilterPopover = () => {
  const [queries] = useMultiQueryState<{
    tags: string[];
    searchValue: string;
  }>(['tags', 'searchValue']);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );

  return (
    <>
      <Filter.Popover>
        <Filter.Trigger isFiltered={hasFilters} />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Command.Input
                placeholder="Filter"
                variant="secondary"
                className="bg-background"
              />
              <Command.List className="p-1">
                <Filter.Item value="searchValue" inDialog>
                  <IconSearch />
                  Search
                </Filter.Item>
                <Filter.Item value="tags">
                  <IconTags />
                  Tags
                </Filter.Item>
                <Filter.Item value="brand">
                  <IconLabel />
                  Brand
                </Filter.Item>
                <Command.Separator className="my-1" />
                <Filter.Item value="createdAt">
                  <IconCalendarPlus />
                  Created At
                </Filter.Item>
                <Filter.Item value="updatedAt">
                  <IconCalendarUp />
                  Updated At
                </Filter.Item>
                <Filter.Item value="lastSeenAt">
                  <IconCalendarTime />
                  Last Seen At
                </Filter.Item>
                <Filter.Item value="birthday">
                  <IconCalendar />
                  Birthday
                </Filter.Item>
              </Command.List>
            </Command>
          </Filter.View>
          <SelectTagsFilterView />
        </Combobox.Content>
      </Filter.Popover>
      <Filter.Dialog>
        <Filter.View filterKey="searchValue" inDialog>
          <Filter.DialogStringView filterKey="searchValue" />
        </Filter.View>
      </Filter.Dialog>
    </>
  );
};

export const CustomersFilter = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
  }>(['searchValue']);

  return (
    <Filter id="customers-filter">
      <Filter.Bar>
        {queries.searchValue && (
          <Filter.BarItem>
            <Filter.BarName>
              <IconSearch />
              Search
            </Filter.BarName>
            <Filter.BarButton filterKey="searchValue" inDialog>
              {queries.searchValue}
            </Filter.BarButton>
            <Filter.BarClose filterKey="searchValue" />
          </Filter.BarItem>
        )}
        <SelectTagsFilterBar />

        <CustomersFilterPopover />
        <CustomerTotalCount />
      </Filter.Bar>
    </Filter>
  );
};
