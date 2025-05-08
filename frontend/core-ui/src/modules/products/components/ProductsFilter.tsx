import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { IconSearch } from '@tabler/icons-react';
import { Combobox, Command, Filter } from 'erxes-ui';
import { TagsFilter } from 'ui-modules';

export const ProductsFilter = () => {
  return (
    <Filter id="products-filter">
      <Filter.Bar className="overflow-auto styled-scroll">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <ProductsFilterPopover />
        </div>
      </Filter.Bar>
    </Filter>
  );
};

export const ProductsFilterPopover = () => {
  return (
    <>
      <Filter.Popover scope={PageHotkeyScope.ProductsPage}>
        <Filter.Trigger />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Filter.CommandInput placeholder="Filter" variant="secondary" />

              <Command.List className="p-1">
                <Filter.Item value="searchValue" inDialog>
                  <IconSearch />
                  Search
                </Filter.Item>
                <TagsFilter />
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
    </>
  );
};
