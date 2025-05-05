import { IconUsers } from '@tabler/icons-react';
import { Breadcrumb, Button, PageHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { ContactsPath } from '~/modules/types/paths/ContactsPath';
import { CustomerAddSheet } from './CustomerAddSheet';

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
        <CustomerAddSheet />
      </PageHeader.End>
    </PageHeader>
  );
};
