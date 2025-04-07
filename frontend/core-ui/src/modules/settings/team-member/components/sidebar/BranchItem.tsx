import {
  Combobox,
  Command,
  SelectTreeProvider,
  Skeleton,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { CollapsibleItemWrapper } from '@/settings/team-member/components/sidebar/CollapsibleItemWrapper';
import { IBranch, SelectBranchItem, useBranchesMain } from 'ui-modules';

export function BranchItem() {
  const { loading, branches, error } = useBranchesMain();
  const [branchId, setBranchId] = useQueryState<string>('branchId');
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
      <CollapsibleItemWrapper label="Branch" open>
        <Command shouldFilter={false} className="bg-transparent">
          <Command.List className="pl-9 py-0 pr-0">
            <Combobox.Empty error={error} loading={loading} />
            {branches?.map((branch: IBranch) => (
              <SelectBranchItem
                key={branch._id}
                totalCount={branch.userCount || 0}
                branch={branch}
                selected={branchId === branch?._id}
                onSelect={() => {
                  setBranchId(branch._id);
                  resetFilterState();
                }}
                hasChildren={
                  branches?.find((c: IBranch) => c.parentId === branch._id) !==
                  undefined
                }
              />
            ))}
          </Command.List>
        </Command>
      </CollapsibleItemWrapper>
    </SelectTreeProvider>
  );
}
