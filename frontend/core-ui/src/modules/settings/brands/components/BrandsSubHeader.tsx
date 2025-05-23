import { IconCalendarPlus, IconSearch } from '@tabler/icons-react';
import {
  Combobox,
  Command,
  Filter,
  PageSubHeader,
  useMultiQueryState,
} from 'erxes-ui';
import React from 'react';

export const BrandsSubHeader = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    created: string;
  }>(['searchValue', 'created']);
  const { searchValue, created } = queries || {};
  return (
    <Filter id="brands">
      <PageSubHeader>
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

          <Filter.Popover scope="brands-page">
            <Filter.Trigger />
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
                    <Command.Separator className="my-1" />
                    <Filter.Item value="created">
                      <IconCalendarPlus />
                      Created At
                    </Filter.Item>
                  </Command.List>
                </Command>
              </Filter.View>
              <Filter.View filterKey="created">
                <Filter.DateView filterKey="created" />
              </Filter.View>
            </Combobox.Content>
          </Filter.Popover>
          <Filter.Dialog>
            <Filter.View filterKey="searchValue" inDialog>
              <Filter.DialogStringView filterKey="searchValue" />
            </Filter.View>
          </Filter.Dialog>
        </Filter.Bar>
      </PageSubHeader>
    </Filter>
  );
};
