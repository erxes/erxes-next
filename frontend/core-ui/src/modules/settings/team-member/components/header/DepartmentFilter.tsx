import { Filter, SelectTree, useFilterContext, useQueryState } from 'erxes-ui';
import { SelectDepartmentCommand } from 'ui-modules';

export function DepartmentFilter() {
  const [departmentId, setDepartmentId] = useQueryState<string>('departmentId');
  const { resetFilterState } = useFilterContext();
  return (
    <SelectTree.Provider id="select-department" ordered>
      <Filter.View filterKey={'departmentId'}>
        <SelectDepartmentCommand
          focusOnMount
          selected={departmentId ?? undefined}
          onSelect={(departmentId) => {
            setDepartmentId(departmentId);
            resetFilterState();
          }}
        />
      </Filter.View>
    </SelectTree.Provider>
  );
}
