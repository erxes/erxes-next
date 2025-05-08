import { CompaniesHeader } from '@/contacts/companies/components/CompaniesHeader';
import { CompaniesRecordTable } from '@/contacts/companies/components/CompaniesRecordTable';
import { CompaniesFilter } from '@/contacts/companies/components/CompaniesFilter';
export const CompaniesIndexPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <CompaniesHeader />
      <CompaniesFilter />
      <CompaniesRecordTable />
    </div>
  );
};
