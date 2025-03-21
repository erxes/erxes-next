import { RecordTable } from 'erxes-ui/modules/record-table';
import { Skeleton } from 'erxes-ui';
import { USERS_PER_PAGE, useUsers } from '../hooks/useUsers';
import { teamMemberColumns } from './record/TeamMemberColumns';
import { teamMemberMoreColumn } from './record/TeamMemberMoreColumn';

const TeamMemberTable = () => {
  const { users, totalCount, handleFetchMore, loading, error } = useUsers({
    page: 1,
    perPage: USERS_PER_PAGE,
  });
  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }
  if (error) {
    return (
      <div className="text-destructive">
        Error loading permissions: {error.message}
      </div>
    );
  }
  return (
    <RecordTable.Provider
      columns={teamMemberColumns}
      data={users || []}
      stickyColumns={['avatar', 'firstName']}
      handleReachedBottom={handleFetchMore}
      className="mt-1.5"
      moreColumn={teamMemberMoreColumn}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > users?.length && (
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

export { TeamMemberTable };
