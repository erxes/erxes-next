import { AddCustomerForm } from '@/contacts/customers-new/components/AddCustomerForm';
import { IconUsers } from '@tabler/icons-react';
import { Breadcrumb, Button, PageHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { ContactsPath } from '~/modules/types/paths/ContactsPath';

export const CustomersHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to={`/contacts/${ContactsPath.Customers}`}>
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
      <PageHeader.End>
        <AddCustomerForm />
      </PageHeader.End>
    </PageHeader>
  );
};
