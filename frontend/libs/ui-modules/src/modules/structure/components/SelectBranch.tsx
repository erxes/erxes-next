import {
  Popover,
  Combobox,
  Command,
  cn,
  Skeleton,
  TextOverflowTooltip,
} from 'erxes-ui';
import { IBranch } from '../types/Branch';
import { useBranches } from '../hooks/useBranches';
import { useBranchById } from '../hooks/useBranchById';
import React, { useState } from 'react';
import { SelectBranchContext } from '../contexts/SelectBranchContext';
import { useSelectBranchContext } from '../hooks/useSelectBranchContext';

export const SelectBranch = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    value?: string;
    onValueChange: (value: string) => void;
    className?: string;
  }
>((props, ref) => {
  const { value, onValueChange, className } = props;
  return (
    <SelectBranchProvider>
      <Popover>
        <Combobox.Trigger
          className={cn(
            'w-full flex text-left',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <SelectBranchValue value={value} />
        </Combobox.Trigger>
        <Combobox.Content>
          <BranchesList
            renderItem={(branch) => (
              <SelectBranchItem branch={branch} onValueChange={onValueChange} />
            )}
          />
        </Combobox.Content>
      </Popover>
    </SelectBranchProvider>
  );
});

const SelectBranchItem = ({
  branch,
  onValueChange,
}: {
  branch: IBranch;
  onValueChange: (value: string) => void;
}) => {
  const { setSelectedBranch } = useSelectBranchContext();
  return (
    <Command.Item
      key={branch._id}
      value={branch.title}
      onSelect={() => {
        setSelectedBranch(branch);
        onValueChange(branch._id);
      }}
    >
      <span className="text-muted-foreground">{branch.code}</span>
      <TextOverflowTooltip value={branch.title} />
    </Command.Item>
  );
};

const SelectBranchValue = ({ value }: { value?: string }) => {
  const { selectedBranch } = useSelectBranchContext();
  const { branchDetail, loading } = useBranchById({
    variables: { id: value },
    skip: selectedBranch,
  });
  if (loading) return <Skeleton className="h-4 w-32 overflow-hidden" />;
  return (
    <Combobox.Value
      value={selectedBranch?.title || branchDetail?.title}
      placeholder="Select Branch"
    />
  );
};

export const SelectBranchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedBranch, setSelectedBranch] = useState<IBranch | undefined>(
    undefined,
  );
  return (
    <SelectBranchContext.Provider value={{ selectedBranch, setSelectedBranch }}>
      {children}
    </SelectBranchContext.Provider>
  );
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
        <Combobox.Empty loading={loading} />
        {branches?.map((branch: IBranch) => renderItem(branch))}
      </Command.List>
    </Command>
  );
};
