import { RecordTable } from 'erxes-ui';
import {
  useCompanies,
  COMPANIES_PER_PAGE,
} from '@/contacts/companies/hooks/useCompanies';

import { companyColumns } from '@/contacts/companies/components/CompanyColumns';

export const CompaniesRecordTable = () => {
  const { companies, handleFetchMore, loading, pageInfo } = useCompanies();

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
        sessionKey="companies_cursor"
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
              startCursor={startCursor}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.RowList />
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
