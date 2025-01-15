import { IconUsers } from '@tabler/icons-react';
import { Button } from 'erxes-ui/components/button';
import { FilterDropdown } from 'erxes-ui/modules/filter/componets/FilterDropdown';
import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';
import { contactsFilters } from './filters';
import { FilterBarWithHook } from 'erxes-ui/modules/filter/componets/FilterBarWithHook';
import { ContactDateFilterDialog } from '@/contacts/contacts-filter/components/ContactDateFilter';

const ContactsHeader = () => {
  return (
    <>
      <PluginHeader title="Contacts" icon={IconUsers}>
        <FilterDropdown filters={contactsFilters} />
        <Button>Add Contact</Button>
      </PluginHeader>
      <FilterBarWithHook filters={contactsFilters} />
      <ContactDateFilterDialog />
    </>
  );
};

export default ContactsHeader;
