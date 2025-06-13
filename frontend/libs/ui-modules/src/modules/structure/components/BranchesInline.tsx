import {
  BranchesInlineContext,
  useBranchesInlineContext,
} from '../contexts/BranchesInlineContext';
import { Combobox, isUndefinedOrNull, Tooltip } from 'erxes-ui';
import { IBranch } from '../types/Branch';
import { useEffect } from 'react';
import { useBranchesInline } from '../hooks/useBranches';

interface BranchesInlineProviderProps {
  children: React.ReactNode;
  branchIds?: string[];
  branches?: IBranch[];
  placeholder?: string;
  updateBranches?: (branches: IBranch[]) => void;
}

const BranchesInlineProvider = ({
  children,
  placeholder,
  branchIds,
  branches,
  updateBranches,
}: BranchesInlineProviderProps) => {
  return (
    <BranchesInlineContext.Provider
      value={{
        branches: branches || [],
        loading: false,
        placeholder: isUndefinedOrNull(placeholder)
          ? 'Select branches'
          : placeholder,
        updateBranches,
      }}
    >
      <Tooltip.Provider>{children}</Tooltip.Provider>
      {branchIds?.some(
        (id) => !branches?.some((branch) => branch._id === id),
      ) && (
        <BranchesInlineEffectComponent
          branchIdsWithNoDetails={branchIds.filter(
            (id) => !branches?.some((branch) => branch._id === id),
          )}
        />
      )}
    </BranchesInlineContext.Provider>
  );
};

const BranchesInlineEffectComponent = ({
  branchIdsWithNoDetails,
}: {
  branchIdsWithNoDetails: string[];
}) => {
  const { updateBranches, branches } = useBranchesInlineContext();
  const { branches: detailMissingBranches } = useBranchesInline({
    variables: {
      _ids: branchIdsWithNoDetails,
    },
  });

  useEffect(() => {
    if (detailMissingBranches && detailMissingBranches.length > 0) {
      const existingbranchesMap = new Map(
        branches.map((branch) => [branch._id, branch]),
      );
      const newBranches = detailMissingBranches.filter(
        (branch) => !existingbranchesMap.has(branch._id),
      );

      if (newBranches.length > 0) {
        updateBranches?.([...branches, ...newBranches]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailMissingBranches, updateBranches, branchIdsWithNoDetails]);

  return null;
};

const BranchesInlineTitle = () => {
  const { branches, loading, placeholder } = useBranchesInlineContext();

  const getDisplayValue = () => {
    if (branches.length === 0) return undefined;

    if (branches.length === 1) {
      if (!branches[0].title) {
        return;
      }
      return branches[0].title;
    }

    return `${branches.length} branches selected`;
  };

  return (
    <span className="flex items-center gap-2">
      {branches.length === 1 && (
        <span className="text-muted-foreground">{branches[0].code}</span>
      )}
      <Combobox.Value
        value={getDisplayValue()}
        loading={loading}
        placeholder={placeholder}
      />
    </span>
  );
};

const BranchesInlineRoot = ({
  branchIds,
  branches,
  placeholder,
  updateBranches,
}: Omit<BranchesInlineProviderProps, 'children'>) => {
  return (
    <BranchesInlineProvider
      branchIds={branchIds}
      branches={branches}
      placeholder={placeholder}
      updateBranches={updateBranches}
    >
      <BranchesInline.Title />
    </BranchesInlineProvider>
  );
};

export const BranchesInline = Object.assign(BranchesInlineRoot, {
  Provider: BranchesInlineProvider,
  Title: BranchesInlineTitle,
});
