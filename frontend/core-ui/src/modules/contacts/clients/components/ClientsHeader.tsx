import { ContactsBreadcrumb } from '@/contacts/components/ContactsBreadcrumb';
import { PageHeader } from 'ui-modules';

export const ClientsHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <ContactsBreadcrumb />
      </PageHeader.Start>
    </PageHeader>
  );
};
