import { ProductHotKeyScope } from '@/products/types/ProductsHotKeyScope';
import { IconSearch } from '@tabler/icons-react';
import { Combobox, Command, Filter, useMultiQueryState } from 'erxes-ui';
import { TagsFilter, SelectBrand, SelectCategory } from 'ui-modules';
import { PRODUCTS_CURSOR_SESSION_KEY } from '../constants/productsCursorSessionKey';

export const ProductsFilter = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    created: string;
    updated: string;
    lastSeen: string;
    brandId: string;
    categoryId: string;
  }>(['searchValue', 'created', 'updated', 'lastSeen', 'brandId', 'categoryId']);
  const { searchValue } = queries || {};

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
        <SelectBrand.FilterBar />
        <SelectCategory.FilterBar />
        <ProductsFilterPopover />
      </Filter.Bar>
    </Filter>
  );
};

const ProductsFilterPopover = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    created: string;
    updated: string;
    lastSeen: string;
    brandId: string;
    categoryId: string;
  }>(['searchValue', 'created', 'updated', 'lastSeen', 'brandId', 'categoryId']);

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
                <SelectBrand.FilterItem />
                <SelectCategory.FilterItem />
              </Command.List>
            </Command>
          </Filter.View>
          <TagsFilter.View tagType="core:product" />
          <SelectBrand.FilterView />
          <SelectCategory.FilterView />
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
