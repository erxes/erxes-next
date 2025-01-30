import { IconUsers } from '@tabler/icons-react';

import { FilterDropdown } from 'erxes-ui/modules/filter/componets/FilterDropdown';
import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';

import { ContactsFilter } from './ContactsFilter';
import { contactsFilters } from './filters';

import { AddCustomerForm } from '@/contacts/AddContacts/AddCustomerForm';
import { ContactDateFilterDialog } from '@/contacts/contacts-filter/components/ContactDateFilter';

export const ContactsHeader = () => {
  return (
    <>
      <PluginHeader title="Contacts" icon={IconUsers}>
        <FilterDropdown filters={contactsFilters} />
        <AddCustomerForm />
      </PluginHeader>
      <ContactsFilter />
      <ContactDateFilterDialog />
    </>
  );
};
