import { IconMagnetFilled, IconUserFilled } from '@tabler/icons-react';
import { Breadcrumb, Button, PageHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { ContactsPath } from '~/modules/types/paths/ContactsPath';
import { CustomerAddSheet } from './CustomerAddSheet';
import { useLocation } from 'react-router-dom';
import { ContactsBreadcrumb } from '@/contacts/components/ContactsBreadcrumb';

export const CustomersHeader = () => {
  const pathname = useLocation().pathname;
  return (
    <PageHeader>
      <PageHeader.Start>
        <ContactsBreadcrumb>
          {pathname.includes(ContactsPath.Leads) ? (
            <>
              <Breadcrumb.Page>
                <Button variant="ghost" asChild>
                  <Link to={`/contacts/${ContactsPath.Leads}`}>
                    <IconMagnetFilled />
                    Leads
                  </Link>
                </Button>
              </Breadcrumb.Page>
            </>
          ) : (
            <Breadcrumb.Page>
              <Button variant="ghost" asChild>
                <Link to={`/contacts/${ContactsPath.Customers}`}>
                  <IconUserFilled />
                  Customers
                </Link>
              </Button>
            </Breadcrumb.Page>
          )}
        </ContactsBreadcrumb>
        <PageHeader.LikeButton />
      </PageHeader.Start>
      <PageHeader.End>
        <CustomerAddSheet />
      </PageHeader.End>
    </PageHeader>
  );
};
