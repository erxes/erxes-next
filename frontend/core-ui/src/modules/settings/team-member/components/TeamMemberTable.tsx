import { RecordTable } from 'erxes-ui';
import { Skeleton } from 'erxes-ui';
import {
  USERS_PER_PAGE,
  useUsers,
} from '@/settings/team-member/hooks/useUsers';
import { teamMemberColumns } from '@/settings/team-member/components/record/TeamMemberColumns';

const TeamMemberTable = () => {
  const { users, handleFetchMore, loading, error, pageInfo } = useUsers();
  const { hasPreviousPage, hasNextPage, startCursor, endCursor } =
    pageInfo || {};

  if (error) {
    return (
      <div className="text-destructive">
        Error loading members: {error.message}
      </div>
    );
  }
  return (
    <RecordTable.Provider
      columns={teamMemberColumns}
      data={users || []}
      stickyColumns={['more', 'avatar', 'firstName', 'lastName']}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        loading={loading}
        dataLength={users?.length}
        sessionKey="products_cursor"
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.RowList />
            <RecordTable.CursorForwardSkeleton
              handleFetchMore={handleFetchMore}
            />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.CursorProvider>
    </RecordTable.Provider>
  );
};

export { TeamMemberTable };
