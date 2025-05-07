import {
  PERMISSIONS_PER_PAGE,
  usePermissions,
} from '@/settings/permission/hooks/usePermission';
import { RecordTable } from 'erxes-ui';
import { permissionColumns } from '@/settings/permission/components/PermissionColumns';
import { permissionMoreColumn } from '@/settings/permission/components/PermissionMoreColumn';
import { Skeleton } from 'erxes-ui';

const PermissionTable = () => {
  const { permissions, totalCount, handleFetchMore, loading, error } =
    usePermissions({
      page: 1,
      perPage: PERMISSIONS_PER_PAGE,
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
