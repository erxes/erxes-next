import { IconBuilding } from '@tabler/icons-react';
import { Breadcrumb, Button } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { ContactsPath } from '@/types/paths/ContactsPath';
import { ContactsBreadcrumb } from '@/contacts/components/ContactsBreadcrumb';

export const CompaniesHeader = () => {
  return (
    <>
      <PageHeader>
        <PageHeader.Start>
          <ContactsBreadcrumb>
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to={ContactsPath.Companies}>
                  <IconBuilding />
                  Companies
                </Link>
              </Button>
            </Breadcrumb.Item>
          </ContactsBreadcrumb>
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>
    </>
  );
};
