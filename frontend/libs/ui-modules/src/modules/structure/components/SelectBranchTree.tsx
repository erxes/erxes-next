import React, { useEffect, useRef, useState } from 'react';
import {
  Combobox,
  Command,
  InlineCell,
  InlineCellDisplay,
  InlineCellEdit,
  SelectTree,
  TextOverflowTooltip,
} from 'erxes-ui';
import { Except } from 'type-fest';
import { IBranch } from '../types/Branch';
import { useBranchesMain } from '../hooks/useBranchesMain';
import { useDebounce } from 'use-debounce';

export const SelectBranchTree = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Except<
    React.ComponentPropsWithoutRef<typeof Combobox.Trigger>,
    'onSelect'
  > & {
    selected?: string;
    onSelect: (categoryId: string | null) => void;
    recordId: string;
    nullable?: boolean;
    exclude?: string[];
  }
>(({ onSelect, selected, recordId, nullable, exclude, ...props }, ref) => {
  const [selectedBranch, setSelectedBranch] = useState<IBranch | undefined>();
  const { branches, loading, totalCount, totalUsersCount } = useBranchesMain({
    onCompleted: ({ branches: list }: { branches: IBranch[] }) => {
      setSelectedBranch(list.find((branch) => branch._id === selected));
    },
  });
  useEffect(() => {
    if (branches && selected) {
      setSelectedBranch(branches.find((branch) => branch._id === selected));
    }
  }, [selected, branches]);
  return (
    <SelectTree.Provider id="select-branch" ordered>
      <InlineCell
        name="branch"
        recordId={recordId}
        display={() => (
          <SelectBranchTrigger
            ref={ref}
            {...props}
            selectedBranch={selectedBranch}
            loading={loading}
            totalCount={selectedBranch?.userCount || 0}
          />
        )}
        edit={(closeEditMode) => (
          <InlineCellEdit>
            <SelectBranchCommand
              nullable={nullable}
              exclude={exclude}
              selected={selected}
              onSelect={(branchId) => {
                onSelect(branchId);
                setSelectedBranch(
                  branches?.find((branch) => branch._id === branchId)!,
                );
                closeEditMode();
              }}
            />
          </InlineCellEdit>
        )}
      />
    </SelectTree.Provider>
  );
});

export const SelectBranchCommand = ({
  selected,
  onSelect,
  focusOnMount,
  nullable,
  exclude,
}: {
  selected?: string;
  onSelect: (categoryId: string | null) => void;
  focusOnMount?: boolean;
  nullable?: boolean;
  exclude?: string[];
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { branches, loading, error } = useBranchesMain({
    variables: {
      searchValue: debouncedSearch ?? undefined,
    },
  });
  const selectedBranch = branches?.find((branch) => branch._id === selected);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && focusOnMount) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  return (
    <Command shouldFilter={false}>
      <Command.Input
        variant="secondary"
        placeholder="Filter by branch"
        ref={inputRef}
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
      <Command.Separator />
      <Command.List className="p-1">
        <Combobox.Empty error={error} loading={loading} />
        {nullable && (
          <Command.Item key="null" value="null" onSelect={() => onSelect(null)}>
            No category selected
          </Command.Item>
        )}
        {branches?.map((branch: IBranch) => (
          <SelectBranchItem
            key={branch._id}
            totalCount={branch.userCount || 0}
            branch={branch}
            selected={selectedBranch?._id === branch._id}
            onSelect={() => onSelect(branch._id)}
            disabled={exclude?.includes(branch._id)}
            hasChildren={
              branches.find((c: IBranch) => c.parentId === branch._id) !==
              undefined
            }
          />
        ))}
      </Command.List>
    </Command>
  );
};

export const SelectBranchItem = ({
  totalCount,
  branch,
  selected,
  onSelect,
  hasChildren,
  disabled,
}: {
  totalCount: number;
  branch: IBranch;
  selected: boolean;
  onSelect: () => void;
  hasChildren: boolean;
  disabled?: boolean;
}) => {
  const { title, code, order } = branch;

  return (
    <SelectTree.Item
      order={order}
      hasChildren={hasChildren}
      name={title}
      value={code + title}
      onSelect={onSelect}
      selected={false}
      disabled={disabled}
    >
      <SelectBranchBadge
        branch={branch}
        selected={selected}
        totalCount={totalCount}
      />
    </SelectTree.Item>
  );
};

const SelectBranchBadge = ({
  branch,
  selected,
  totalCount,
}: {
  totalCount: number;
  branch?: IBranch;
  selected?: boolean;
}) => {
  if (!branch) return null;

  const { title, code } = branch;

  return (
    <>
      <div className="flex items-center gap-2 flex-auto overflow-hidden justify-start">
        <div className="text-muted-foreground">{code}</div>
        <TextOverflowTooltip value={title} className="flex-auto" />
      </div>
      {!selected ? (
        totalCount > 0 && (
          <div className="text-muted-foreground ml-auto">{totalCount}</div>
        )
      ) : (
        <Combobox.Check checked={selected} />
      )}
    </>
  );
};

const SelectBranchTrigger = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    totalCount: number;
    selectedBranch?: IBranch;
    loading?: boolean;
  }
>(({ selectedBranch, loading, totalCount, ...props }, ref) => {
  return (
    <InlineCellDisplay asChild>
      <Combobox.Trigger {...props} ref={ref}>
        {selectedBranch ? (
          <SelectBranchBadge branch={selectedBranch} totalCount={totalCount} />
        ) : (
          <Combobox.Value placeholder="Select a branch" />
        )}
      </Combobox.Trigger>
    </InlineCellDisplay>
  );
});
