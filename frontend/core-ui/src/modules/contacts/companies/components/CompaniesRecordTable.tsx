import { RecordTable } from 'erxes-ui';
import {
  useCompanies,
  COMPANIES_PER_PAGE,
} from '@/contacts/companies/hooks/useCompanies';

import { companyColumns } from '@/contacts/companies/components/CompanyColumns';

export const CompaniesRecordTable = () => {
  const { companies, handleFetchMore, loading, pageInfo } = useCompanies({
    variables: {
      perPage: COMPANIES_PER_PAGE,
      page: 1,
    },
  });

  const { hasPreviousPage, hasNextPage, startCursor, endCursor } =
    pageInfo || {};

  return (
    <RecordTable.Provider
      columns={companyColumns}
      data={companies || []}
      stickyColumns={['more', 'checkbox', 'avatar', 'name']}
      className="mt-1.5"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={companies?.length}
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
              startCursor={startCursor}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.CursorRowList />
            <RecordTable.CursorForwardSkeleton
              handleFetchMore={handleFetchMore}
              endCursor={endCursor}
            />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.CursorProvider>
    </RecordTable.Provider>
  );
};
