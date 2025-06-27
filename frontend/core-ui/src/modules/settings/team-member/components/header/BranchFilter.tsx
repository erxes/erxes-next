import { Filter, SelectTree, useFilterContext, useQueryState } from 'erxes-ui';
import { SelectBranchCommand } from 'ui-modules';

export function BranchFilter() {
  const [branchId, setBranchId] = useQueryState<string>('branchId');
  const { resetFilterState } = useFilterContext();
  return (
    <SelectTree.Provider id="user-branch-filter" ordered>
      <Filter.View filterKey={'branchId'}>
        <SelectBranchCommand
          focusOnMount
          selected={branchId ?? undefined}
          onSelect={(branchId) => {
            setBranchId(branchId);
            resetFilterState();
          }}
        />
      </Filter.View>
    </SelectTree.Provider>
  );
}
