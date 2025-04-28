import { IconUsers } from '@tabler/icons-react';
import { PluginHeader } from 'erxes-ui';
import { ContactsPath } from '~/modules/types/paths/ContactsPath';

export const CustomersHeader = () => {
  return (
    <PluginHeader
      title="Customers"
      icon={IconUsers}
      to={`/contacts/${ContactsPath.Customers}`}
    />
  );
};
