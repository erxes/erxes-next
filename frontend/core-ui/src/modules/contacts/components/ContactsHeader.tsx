import { IconUsers } from '@tabler/icons-react';
import { Breadcrumb, Button, PageHeader, Separator } from 'erxes-ui';

import { AddCustomerForm } from '@/contacts/customers/components/AddCustomerForm';
import { ContactsPath } from '@/types/paths/ContactsPath';
import { Link } from 'react-router-dom';

export const ContactsHeader = () => {
  return (
    <>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to={ContactsPath.Customers}>
                    <IconUsers />
                    Contacts
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.LikeButton />
        </PageHeader.Start>
      </PageHeader>
      <AddCustomerForm />
    </>
  );
};
