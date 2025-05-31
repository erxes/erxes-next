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
                    <Filter.SearchValueTrigger />
                  </Command.List>
                </Command>
              </Filter.View>
            </Combobox.Content>
          </Filter.Popover>
          <Filter.Dialog>
            <Filter.View filterKey="searchValue" inDialog>
              <Filter.DialogStringView filterKey="searchValue" />
            </Filter.View>
          </Filter.Dialog>
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
        </Filter.Bar>
      </PageSubHeader>
    </Filter>
  );
};
