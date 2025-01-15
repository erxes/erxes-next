import { IconCalendar, IconCategoryPlus } from '@tabler/icons-react';
import { Filter } from 'erxes-ui/modules/filter/types/filter';
import { ContactTypeFilterBar } from '../contacts-filter/components/ContactTypeFilter';
import { ContactTypeFilterDropdown } from '../contacts-filter/components/ContactTypeFilter';
import { ContactDateFilter } from '../contacts-filter/components/ContactDateFilter';
import { ContactDateFilterDropdown } from '../contacts-filter/components/ContactDateFilter';

export const contactsFilters: Filter[] = [
  {
    label: 'Type',
    accessoryKey: 'type',
    icon: IconCategoryPlus,
    condition: 'is',
    dropdown: (props) => <ContactTypeFilterDropdown {...props} />,
    bar: () => <ContactTypeFilterBar />,
  },
  {
    label: 'Date',
    accessoryKey: 'date',
    icon: IconCalendar,
    condition: 'is',
    dropdown: () => <ContactDateFilterDropdown />,
    bar: () => <ContactDateFilter />,
  },
];
