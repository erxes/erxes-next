import { FilterBarWithHook } from 'erxes-ui';

import { contactsFilters } from './filters';
import { useContactFilterValues } from '../contacts-filter/hooks/useContactFilterValues';

export const ContactsFilter = () => {
  const { activeFilters } = useContactFilterValues();
  return (
    <FilterBarWithHook
      activeFilters={
        contactsFilters.filter(
          (filter) =>
            activeFilters[filter.accessoryKey as keyof typeof activeFilters],
        ) || []
      }
    />
  );
};
