import { ContactsHotKeyScope } from '@/contacts/types/ContactsHotKeyScope';
import { Filter, useMultiQueryState } from 'erxes-ui';
import { COMPANIES_CURSOR_SESSION_KEY } from '../constants/companiesCursorSessionKey';

export const CompaniesFilter = () => {
  return (
    <Filter id="companies-filter" sessionKey={COMPANIES_CURSOR_SESSION_KEY}>
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
      <Filter.Popover scope={ContactsHotKeyScope.CompaniesPage}>
        <Filter.Trigger isFiltered={hasFilters} />
      </Filter.Popover>
    </>
  );
};
