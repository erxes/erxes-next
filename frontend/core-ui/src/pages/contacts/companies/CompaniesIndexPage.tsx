import { CompaniesHeader } from '@/contacts/companies/components/CompaniesHeader';
import { CompaniesRecordTable } from '@/contacts/companies/components/CompaniesRecordTable';

export const CompaniesIndexPage = () => {
  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <CompaniesHeader />
      <CompaniesRecordTable />
    </div>
  );
};
