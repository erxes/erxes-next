import { ProductHotKeyScope } from '@/products/types/ProductsHotKeyScope';
import {
  IconCalendarPlus,
  IconCalendarTime,
  IconCalendarUp,
  IconSearch,
} from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';
import { TagsFilter } from 'ui-modules';
import { PRODUCTS_CURSOR_SESSION_KEY } from '../constants/productsCursorSessionKey';

export const ProductsFilter = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    created: string;
    updated: string;
    lastSeen: string;
    tags: string[];
  }>(['searchValue', 'created', 'updated', 'lastSeen', 'tags']);
  const { searchValue, created, updated, lastSeen } = queries || {};

  return (
    <Filter id="products-filter" sessionKey={PRODUCTS_CURSOR_SESSION_KEY}>
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
        <TagsFilter.Bar tagType="core:product" />
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
        <ProductsFilterPopover />
      </Filter.Bar>
    </Filter>
  );
};

const ProductsFilterPopover = () => {
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
      <Filter.Popover scope={ProductHotKeyScope.ProductsPage}>
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
              </Command.List>
            </Command>
          </Filter.View>
          <TagsFilter.View tagType="core:product" />
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
