import {
  Combobox,
  Command,
  SelectTreeProvider,
  Skeleton,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { CollapsibleItemWrapper } from '@/settings/team-member/components/sidebar/CollapsibleItemWrapper';
import {
  IDepartment,
  SelectDepartmentItem,
  useDepartmentsMain,
} from 'ui-modules';

export function DepartmentItem() {
  const { loading, departments, error } = useDepartmentsMain();
  const [departmentId, setDepartmentId] = useQueryState<string>('departmentId');
  const { resetFilterState } = useFilterContext();

  if (loading) {
    return (
      <div className="py-4 px-2">
        <Skeleton className="w-full h-32" />
      </div>
    );
  }
  return (
    <SelectTreeProvider id="select-branch" ordered>
      <CollapsibleItemWrapper label="Department" open>
        <Command shouldFilter={false} className="bg-transparent">
          <Command.List className="pl-9 py-0 pr-0">
            <Combobox.Empty error={error} loading={loading} />
            {departments?.map((department: IDepartment) => (
              <SelectDepartmentItem
                key={department._id}
                department={department}
                selected={departmentId === department?._id}
                onSelect={() => {
                  setDepartmentId(department._id);
                  resetFilterState();
                }}
                hasChildren={
                  departments?.find(
                    (c: IDepartment) => c.parentId === department._id,
                  ) !== undefined
                }
              />
            ))}
          </Command.List>
        </Command>
      </CollapsibleItemWrapper>
    </SelectTreeProvider>
  );
}
