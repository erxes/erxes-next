import { SelectBranchesContext } from '../contexts/SelectBranchesContext';
import { IBranch } from '../types/Branch';
import { useSelectBranchesContext } from '../contexts/SelectBranchesContext';
import { useBranches } from '../hooks/useBranches';
import { useDebounce } from 'use-debounce';
import { useState } from 'react';
import { cn, Combobox, Command, Popover } from 'erxes-ui';
import {
  RecordTablePopover,
  RecordTableCellContent,
  RecordTableCellTrigger,
} from 'erxes-ui';
import { TextOverflowTooltip } from 'erxes-ui';
import { BranchesInline } from './BranchesInline';

interface SelectBranchesProviderProps {
  children: React.ReactNode;
  value?: string[] | string;
  onValueChange?: (value: string[] | string) => void;
  mode?: 'single' | 'multiple';
}

const SelectBranchesProvider = ({
  children,
  value,
  onValueChange,
  mode = 'single',
}: SelectBranchesProviderProps) => {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const branchIds = !value ? [] : Array.isArray(value) ? value : [value];

  const onSelect = (branch: IBranch) => {
    if (!branch) return;
    if (mode === 'single') {
      setBranches([branch]);
      onValueChange?.(branch._id);
      return;
    }
    const arrayValue = Array.isArray(value) ? value : [];
    const isBranchSelected = arrayValue.includes(branch._id);
    const newSelectedBranchIds = isBranchSelected
      ? arrayValue.filter((id) => id !== branch._id)
      : [...arrayValue, branch._id];

    setBranches((prevBranches) => {
      const branchMap = new Map(prevBranches.map((b) => [b._id, b]));
      branchMap.set(branch._id, branch);
      return newSelectedBranchIds
        .map((id) => branchMap.get(id))
        .filter((b): b is IBranch => b !== undefined);
    });
    onValueChange?.(newSelectedBranchIds);
  };

  return (
    <SelectBranchesContext.Provider
      value={{
        branchIds,
        onSelect,
        branches,
        setBranches,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectBranchesContext.Provider>
  );
};

const SelectBranchesContent = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { branchIds, branches } = useSelectBranchesContext();
  const {
    branches: branchesData,
    loading,
    handleFetchMore,
    totalCount,
    error,
  } = useBranches({
    variables: {
      searchValue: debouncedSearch,
    },
  });

  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        variant="secondary"
        wrapperClassName="flex-auto"
        focusOnMount
      />
      <Command.List className="max-h-[300px] overflow-y-auto">
        {branches?.length > 0 && (
          <>
            {branches.map((branch) => (
              <SelectBranchCommandItem key={branch._id} branch={branch} />
            ))}
            <Command.Separator className="my-1" />
          </>
        )}
        <Combobox.Empty loading={loading} error={error} />
        {!loading &&
          branchesData
            ?.filter(
              (branch) =>
                !branchIds.find((branchId) => branchId === branch._id),
            )
            .map((branch) => (
              <SelectBranchCommandItem key={branch._id} branch={branch} />
            ))}

        {!loading && (
          <Combobox.FetchMore
            fetchMore={handleFetchMore}
            currentLength={branchesData?.length || 0}
            totalCount={totalCount}
          />
        )}
      </Command.List>
    </Command>
  );
};

const SelectBranchCommandItem = ({ branch }: { branch: IBranch }) => {
  const { onSelect, branchIds } = useSelectBranchesContext();
  return (
    <Command.Item value={branch._id} onSelect={() => onSelect(branch)}>
      <TextOverflowTooltip value={branch.title} />
      <span className="text-muted-foreground">{branch.code}</span>
      <Combobox.Check checked={branchIds.includes(branch._id)} />
    </Command.Item>
  );
};

const SelectBranchInlineCell = ({
  onValueChange,
  scope,
  ...props
}: Omit<React.ComponentProps<typeof SelectBranchesProvider>, 'children'> & {
  scope?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectBranchesProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableCellTrigger>
          <SelectBranches.Value />
        </RecordTableCellTrigger>
        <RecordTableCellContent>
          <SelectBranches.Content />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectBranchesProvider>
  );
};

const SelectBranchRoot = ({
  onValueChange,
  className,
  mode = 'single',
  ...props
}: Omit<React.ComponentProps<typeof SelectBranchesProvider>, 'children'> & {
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectBranchesProvider
      onValueChange={(value) => {
        if (mode === 'single') {
          setOpen(false);
        }
        onValueChange?.(value);
      }}
      mode={mode}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.Trigger
          className={cn('w-full inline-flex', className)}
          variant="outline"
        >
          <SelectBranches.Value />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectBranches.Content />
        </Combobox.Content>
      </Popover>
    </SelectBranchesProvider>
  );
};

const SelectBranchesValue = () => {
  const { branchIds, branches, setBranches } = useSelectBranchesContext();

  return (
    <BranchesInline
      branchIds={branchIds}
      branches={branches}
      updateBranches={setBranches}
    />
  );
};

export const SelectBranches = Object.assign(SelectBranchRoot, {
  Provider: SelectBranchesProvider,
  Content: SelectBranchesContent,
  Item: SelectBranchCommandItem,
  InlineCell: SelectBranchInlineCell,
  Value: SelectBranchesValue,
});
