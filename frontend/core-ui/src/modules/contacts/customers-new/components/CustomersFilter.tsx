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

  const handleClose = (tagId?: string) => {
    const filteredTags = tags.filter((t) => t !== tagId);
    setTags(filteredTags.length ? filteredTags : null);
  };

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
              <SelectTags.Value onClose={handleClose} />
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

  const filterItems = [
    {
      value: 'searchValue',
      icon: <IconSearch />,
      label: 'Search',
      inDialog: true,
    },
    { value: 'tags', icon: <IconTags />, label: 'Tags' },
    { value: 'brand', icon: <IconLabel />, label: 'Brand' },
    { value: 'createdAt', icon: <IconCalendarPlus />, label: 'Created At' },
    { value: 'updatedAt', icon: <IconCalendarUp />, label: 'Updated At' },
    { value: 'lastSeenAt', icon: <IconCalendarTime />, label: 'Last Seen At' },
    { value: 'birthday', icon: <IconCalendar />, label: 'Birthday' },
  ];

  return (
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
              {filterItems.slice(0, 3).map((item) => (
                <Filter.Item
                  key={item.value}
                  value={item.value}
                  inDialog={item.inDialog}
                >
                  {item.icon}
                  {item.label}
                </Filter.Item>
              ))}
              <Command.Separator className="my-1" />
              {filterItems.slice(3).map((item) => (
                <Filter.Item key={item.value} value={item.value}>
                  {item.icon}
                  {item.label}
                </Filter.Item>
              ))}
            </Command.List>
          </Command>
        </Filter.View>
        <SelectTagsFilterView />
      </Combobox.Content>
    </Filter.Popover>
  );
};

export const CustomersFilter = () => (
  <Filter id="customers-filter">
    <Filter.Bar>
      <SelectTagsFilterBar />
      <CustomersFilterPopover />
    </Filter.Bar>
  </Filter>
);
