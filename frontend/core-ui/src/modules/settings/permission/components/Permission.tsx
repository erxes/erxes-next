import { usePermissions } from '../hooks/usePermission';

const Permission = () => {
  const { permissions } = usePermissions({
    page: 1,
    perPage: 20,
  });
  return <div>Permission</div>;
};

export { Permission };
