import { IconUsers } from '@tabler/icons-react';
import { PluginHeader } from 'erxes-ui';

import { ContactsFilter } from './ContactsFilter';
import { contactsFilters } from './filters';

import { AddCustomerForm } from '@/contacts/add-contacts/AddCustomerForm';
import { ContactDateFilterDialog } from '@/contacts/contacts-filter/components/ContactDateFilter';
import { FilterDropdown } from 'erxes-ui';
import { ContactsPath } from '@/types/paths/ContactsPath';

export const ContactsHeader = () => {
  return (
    <>
      <PluginHeader
        title="Contacts"
        icon={IconUsers}
        to={`/contacts/${ContactsPath.Customers}`}
      >
        <FilterDropdown filters={contactsFilters} />
        <AddCustomerForm />
      </PluginHeader>
      <ContactsFilter />
      <ContactDateFilterDialog />
    </>
  );
};
