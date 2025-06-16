import { IconMagnetFilled, IconUserFilled } from '@tabler/icons-react';
import { Breadcrumb, Button } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { ContactsPath } from '@/types/paths/ContactsPath';
import { CustomerAddSheet } from './CustomerAddSheet';
import { ContactsBreadcrumb } from '@/contacts/components/ContactsBreadcrumb';
import { useSetAtom } from 'jotai';
import { recordTableCursorAtomFamily } from 'erxes-ui';
import { useIsCustomerLeadSessionKey } from '../hooks/useCustomerLeadSessionKey';

export const CustomersHeader = () => {
  const { sessionKey, isLead } = useIsCustomerLeadSessionKey();
  const setCursor = useSetAtom(recordTableCursorAtomFamily(sessionKey));

  return (
    <PageHeader>
      <PageHeader.Start>
        <ContactsBreadcrumb>
          {isLead ? (
            <>
              <Breadcrumb.Page>
                <Button variant="ghost" asChild onClick={() => setCursor(null)}>
                  <Link to={`/contacts/${ContactsPath.Leads}`}>
                    <IconMagnetFilled />
                    Leads
                  </Link>
                </Button>
              </Breadcrumb.Page>
            </>
          ) : (
            <Breadcrumb.Page>
              <Button variant="ghost" asChild onClick={() => setCursor(null)}>
                <Link to={`/contacts/${ContactsPath.Customers}`}>
                  <IconUserFilled />
                  Customers
                </Link>
              </Button>
            </Breadcrumb.Page>
          )}
        </ContactsBreadcrumb>
        <PageHeader.FavoriteToggleButton />
      </PageHeader.Start>

      <PageHeader.End>{!isLead && <CustomerAddSheet />}</PageHeader.End>
    </PageHeader>
  );
};
