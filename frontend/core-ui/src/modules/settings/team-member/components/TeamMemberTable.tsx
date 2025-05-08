import { RecordTable } from 'erxes-ui';
import { Skeleton } from 'erxes-ui';
import {
  USERS_PER_PAGE,
  useUsers,
} from '@/settings/team-member/hooks/useUsers';
import { teamMemberColumns } from '@/settings/team-member/components/record/TeamMemberColumns';

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
        Error loading members: {error.message}
      </div>
    );
  }
  return (
    <RecordTable.Provider columns={teamMemberColumns} data={users || []}>
      <RecordTable.Scroll>
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.RowList />
            {!loading && totalCount > users?.length && (
              <RecordTable.RowSkeleton
                rows={4}
                handleInView={handleFetchMore}
              />
            )}
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Scroll>
    </RecordTable.Provider>
  );
};

export { TeamMemberTable };
