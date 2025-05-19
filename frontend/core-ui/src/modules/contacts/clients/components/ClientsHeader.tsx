import { Button } from 'erxes-ui';
import { Breadcrumb } from 'erxes-ui';
import { ContactsBreadcrumb } from '@/contacts/components/ContactsBreadcrumb';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { ContactsPath } from '@/types/paths/ContactsPath';

export const ClientsHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <ContactsBreadcrumb>
          <Breadcrumb.Item>
            <Button variant="ghost" asChild>
              <Link to={ContactsPath.Clients}>Clients</Link>
            </Button>
          </Breadcrumb.Item>
        </ContactsBreadcrumb>
      </PageHeader.Start>
    </PageHeader>
  );
};
