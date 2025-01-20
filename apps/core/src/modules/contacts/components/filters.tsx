import { IconCalendar, IconCategoryPlus } from '@tabler/icons-react';
import { Filter } from 'erxes-ui/modules/filter/types/filter';
import { ContactTypeFilterBar } from '../contacts-filter/components/ContactTypeFilter';
import { ContactTypeFilterDropdown } from '../contacts-filter/components/ContactTypeFilter';
import {
  ContactDateFilter,
  ContactDateFilterConditions,
} from '../contacts-filter/components/ContactDateFilter';
import { ContactDateFilterDropdown } from '../contacts-filter/components/ContactDateFilter';

export const contactsFilters: Filter[] = [
  {
    label: 'Type',
    accessoryKey: 'type',
    icon: IconCategoryPlus,
    dropdown: ContactTypeFilterDropdown,
    bar: ContactTypeFilterBar,
    condition: () => <></>,
  },
  {
    label: 'Created date',
    accessoryKey: 'createdAt',
    icon: IconCalendar,
    dropdown: ContactDateFilterDropdown,
    bar: ContactDateFilter,
    condition: ContactDateFilterConditions,
  },
  {
    label: 'Modified date',
    accessoryKey: 'modifiedAt',
    icon: IconCalendar,
    dropdown: ContactDateFilterDropdown,
    bar: ContactDateFilter,
    condition: ContactDateFilterConditions,
  },
  {
    label: 'Last activity date',
    accessoryKey: 'lastSeenAt',
    icon: IconCalendar,
    dropdown: ContactDateFilterDropdown,
    bar: ContactDateFilter,
    condition: ContactDateFilterConditions,
  },

  {
    label: 'Birthday',
    accessoryKey: 'birthday',
    icon: IconCalendar,
    dropdown: ContactDateFilterDropdown,
    bar: ContactDateFilter,
    condition: ContactDateFilterConditions,
  },
];
