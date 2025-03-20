import { PERMISSIONS_PER_PAGE, usePermissions } from '../hooks/usePermission';
import { RecordTable } from 'erxes-ui/modules/record-table';
import { permissionColumns } from './PermissionColumns';
import { permissionMoreColumn } from './PermissionMoreColumn';
import { Skeleton } from 'erxes-ui';

const PermissionTable = () => {
  const { permissions, totalCount, handleFetchMore, loading } = usePermissions({
    page: 1,
    perPage: PERMISSIONS_PER_PAGE,
  });
  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }
  return (
    <RecordTable.Provider
      columns={permissionColumns}
      data={permissions || []}
      handleReachedBottom={handleFetchMore}
      className="mt-1.5"
      moreColumn={permissionMoreColumn}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {!loading && totalCount > permissions?.length && (
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

export { PermissionTable };
