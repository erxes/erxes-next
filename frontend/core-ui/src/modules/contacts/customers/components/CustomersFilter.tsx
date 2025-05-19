import {
  IconCalendar,
  IconCalendarPlus,
  IconCalendarTime,
  IconCalendarUp,
  IconLabel,
  IconSearch,
} from '@tabler/icons-react';

import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';

import { SelectMember, TagsFilter } from 'ui-modules';
import { CustomerTotalCount } from './CustomerTotalCount';
import { CUSTOMERS_CURSOR_SESSION_KEY } from '../constants/customersCursorSessionKey';
import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';

const CustomersFilterPopover = () => {
  const [queries] = useMultiQueryState<{
    tags: string[];
    searchValue: string;
    created: string;
    updated: string;
    lastSeen: string;
  }>(['tags', 'searchValue', 'created', 'updated', 'lastSeen']);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );

  return (
    <>
      <Filter.Popover scope={ContactsHotKeyScope.CustomersPage}>
        <Filter.Trigger isFiltered={hasFilters} />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Filter.CommandInput
                placeholder="Filter"
                variant="secondary"
                className="bg-background"
              />
              <Command.List className="p-1">
                <Filter.Item value="searchValue" inDialog>
                  <IconSearch />
                  Search
                </Filter.Item>
                <TagsFilter />
                <Filter.Item value="brand">
                  <IconLabel />
                  Brand
                </Filter.Item>
                <SelectMember.FilterItem />
                <Command.Separator className="my-1" />
                <Filter.Item value="created">
                  <IconCalendarPlus />
                  Created At
                </Filter.Item>
                <Filter.Item value="updated">
                  <IconCalendarUp />
                  Updated At
                </Filter.Item>
                <Filter.Item value="lastSeen">
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
          <SelectMember.FilterView />
          <TagsFilter.View tagType="core:customer" />
          <Filter.View filterKey="created">
            <Filter.DateView filterKey="created" />
          </Filter.View>
          <Filter.View filterKey="updated">
            <Filter.DateView filterKey="updated" />
          </Filter.View>
          <Filter.View filterKey="lastSeen">
            <Filter.DateView filterKey="lastSeen" />
          </Filter.View>
        </Combobox.Content>
      </Filter.Popover>
      <Filter.Dialog>
        <Filter.View filterKey="searchValue" inDialog>
          <Filter.DialogStringView filterKey="searchValue" />
        </Filter.View>
        <Filter.View filterKey="created" inDialog>
          <Filter.DialogDateView filterKey="created" />
        </Filter.View>
        <Filter.View filterKey="updated" inDialog>
          <Filter.DialogDateView filterKey="updated" />
        </Filter.View>
        <Filter.View filterKey="lastSeen" inDialog>
          <Filter.DialogDateView filterKey="lastSeen" />
        </Filter.View>
      </Filter.Dialog>
    </>
  );
};

export const CustomersFilter = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    created: string;
    updated: string;
    lastSeen: string;
    tags: string[];
  }>(['searchValue', 'created', 'updated', 'lastSeen', 'tags']);
  const { searchValue, created, updated, lastSeen } = queries || {};

  return (
    <Filter id="customers-filter" sessionKey={CUSTOMERS_CURSOR_SESSION_KEY}>
      <Filter.Bar>
        {searchValue && (
          <Filter.BarItem>
            <Filter.BarName>
              <IconSearch />
              Search
            </Filter.BarName>
            <Filter.BarButton filterKey="searchValue" inDialog>
              {searchValue}
            </Filter.BarButton>
            <Filter.BarClose filterKey="searchValue" />
          </Filter.BarItem>
        )}
        <TagsFilter.Bar tagType="core:customer" />
        {created && (
          <Filter.BarItem>
            <Filter.BarName>
              <IconCalendarPlus />
              Created At
            </Filter.BarName>
            <Filter.Date filterKey="created" />
            <Filter.BarClose filterKey="created" />
          </Filter.BarItem>
        )}
        {updated && (
          <Filter.BarItem>
            <Filter.BarName>
              <IconCalendarUp />
              Updated At
            </Filter.BarName>
            <Filter.Date filterKey="updated" />
            <Filter.BarClose filterKey="updated" />
          </Filter.BarItem>
        )}
        {lastSeen && (
          <Filter.BarItem>
            <Filter.BarName>
              <IconCalendarTime />
              Last Seen At
            </Filter.BarName>
            <Filter.Date filterKey="lastSeen" />
            <Filter.BarClose filterKey="lastSeen" />
          </Filter.BarItem>
        )}
        <SelectMember.FilterBar />
        <CustomersFilterPopover />
        <CustomerTotalCount />
      </Filter.Bar>
    </Filter>
  );
};
