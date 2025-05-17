import { CompaniesHeader } from '@/contacts/companies/components/CompaniesHeader';
import { CompaniesRecordTable } from '@/contacts/companies/components/CompaniesRecordTable';
import { CompaniesFilter } from '@/contacts/companies/components/CompaniesFilter';
import { PageContainer } from 'erxes-ui';

export const CompaniesIndexPage = () => {
  return (
    <PageContainer>
      <CompaniesHeader />
      <CompaniesFilter />
      <CompaniesRecordTable />
    </PageContainer>
  );
};
