import { IconUsers } from '@tabler/icons-react';
import { PluginHeader } from 'erxes-ui';

import { AddCustomerForm } from '@/contacts/customers/components/AddCustomerForm';
import { ContactsPath } from '@/types/paths/ContactsPath';

export const ContactsHeader = () => {
  return (
    <>
      <PluginHeader
        title="Customers"
        icon={IconUsers}
        to={`/contacts/${ContactsPath.Customers}`}
      >
        <AddCustomerForm />
      </PluginHeader>
    </>
  );
};
