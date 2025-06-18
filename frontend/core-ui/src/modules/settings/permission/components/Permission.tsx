import { PermissionTable } from '@/settings/permission/components/PermissionTable';
import { PageSubHeader } from 'erxes-ui';
import { Permissions } from 'ui-modules';

const Permission = () => {
  return (
    <div className="w-full overflow-hidden flex flex-col">
      <PageSubHeader>
        <Permissions.Filter />
      </PageSubHeader>
      <Permissions.RecordTable />
    </div>
  );
};

export { Permission };
