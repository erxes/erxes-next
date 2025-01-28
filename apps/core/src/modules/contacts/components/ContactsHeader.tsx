import { IconUsers } from '@tabler/icons-react';
import { FilterDropdown } from 'erxes-ui/modules/filter/componets/FilterDropdown';
import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';
import { contactsFilters } from './filters';
import { ContactDateFilterDialog } from '@/contacts/contacts-filter/components/ContactDateFilter';
import { ContactsFilter } from './ContactsFilter';
import { AddCustomerForm } from '@/contacts/AddContacts/AddCustomerForm';

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
