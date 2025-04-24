import { RecordTable } from 'erxes-ui';
import {
  useCompanies,
  COMPANIES_PER_PAGE,
} from '@/contacts/companies/hooks/useCompanies';

import { companyColumns } from '@/contacts/companies/components/CompanyColumns';
import { contactMoreColumn } from '@/contacts/components/ContactMoreColumn';

export const CompaniesRecordTable = () => {
  const { companies, handleFetchMore, loading, totalCount } = useCompanies({
    variables: {
      perPage: COMPANIES_PER_PAGE,
      page: 1,
    },
  });

  return (
    <RecordTable.Provider
      columns={companyColumns}
      data={companies || []}
      handleReachedBottom={handleFetchMore}
      stickyColumns={['avatar', 'name']}
      className="mt-1.5"
      moreColumn={contactMoreColumn}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > companies?.length && (
            <RecordTable.RowSkeleton
              rows={4}
              handleReachedBottom={handleFetchMore}
            />
          )}
        </RecordTable.Body>
      </RecordTable>
    </RecordTable.Provider>
  );
};
