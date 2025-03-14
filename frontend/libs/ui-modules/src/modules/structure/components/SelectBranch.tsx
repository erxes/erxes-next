import { Popover, Combobox, Command, cn, Skeleton } from 'erxes-ui';
import { IBranch } from '../types/Branch';
import { useBranches } from '../hooks/useBranches';
import { useBranchById } from '../hooks/useBranchById';
import { useState } from 'react';
export const SelectBranch = ({
  value,
  onValueChange,
  className,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}) => {
  const [selectedBranch, setSelectedBranch] = useState<IBranch | undefined>(
    undefined,
  );
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Combobox className={cn('w-full flex', className)}>
          <SelectBranchValue value={value} />
        </Combobox>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <BranchesList
          renderItem={(branch) => (
            <Command.Item key={branch._id} value={branch.title}>
              <span className="text-muted-foreground">{branch.code}</span>
              {branch.title}
            </Command.Item>
          )}
        />
      </Popover.Content>
    </Popover>
  );
};

const SelectBranchValue = ({ value }: { value: string | undefined }) => {
  const { branchDetail, loading } = useBranchById({ variables: { id: value } });
  if (loading) return <Skeleton className="h-4" />;
  return branchDetail?.title;
};

export const BranchesList = ({
  renderItem,
}: {
  renderItem: (branch: IBranch) => React.ReactNode;
}) => {
  const { branches, loading } = useBranches();
  return (
    <Command>
      <Command.Input placeholder="Search branch" />
      <Command.List>
        <Command.Empty>{loading && <Command.Skeleton />}</Command.Empty>
        {branches?.map((branch: IBranch) => renderItem(branch))}
      </Command.List>
    </Command>
  );
};
