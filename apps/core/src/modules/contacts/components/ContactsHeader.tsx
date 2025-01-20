import { IconUsers } from '@tabler/icons-react';
import { Button } from 'erxes-ui/components/button';
import { FilterDropdown } from 'erxes-ui/modules/filter/componets/FilterDropdown';
import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';
import { contactsFilters } from './filters';
import { ContactDateFilterDialog } from '@/contacts/contacts-filter/components/ContactDateFilter';
import { ContactsFilter } from './ContactsFilter';

const ContactsHeader = () => {
  return (
    <>
      <PluginHeader title="Contacts" icon={IconUsers}>
        <FilterDropdown filters={contactsFilters} />
        <Button>Add Contact</Button>
      </PluginHeader>
      <ContactsFilter />
      <ContactDateFilterDialog />
    </>
  );
};

export default ContactsHeader;
