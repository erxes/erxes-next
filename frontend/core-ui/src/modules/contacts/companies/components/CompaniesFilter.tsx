import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { Filter, useMultiQueryState } from 'erxes-ui';

export const CompaniesFilter = () => {
  return (
    <Filter id="companies-filter">
      <Filter.Bar className="overflow-auto styled-scroll">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <CompaniesFilterPopover />
        </div>
      </Filter.Bar>
    </Filter>
  );
};

export const CompaniesFilterPopover = () => {
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
      <Filter.Popover scope={PageHotkeyScope.CompaniesPage}>
        <Filter.Trigger isFiltered={hasFilters} />
      </Filter.Popover>
    </>
  );
};
