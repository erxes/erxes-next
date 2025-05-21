import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client';
import {
  ADD_BRANCH,
  EDIT_BRANCH,
  GET_BRANCHES_LIST,
  REMOVE_BRANCHES,
} from '../graphql';
import { IBranchListItem, TBranchForm } from '../types/branch';
import { useToast } from 'erxes-ui';

interface BranchData {
  branchesMain: {
    list: IBranchListItem[];
    totalCount: number;
  };
}
interface AddBranchResult {
  branchesAdd: TBranchForm;
}

export function useBranchAdd(
  options?: MutationHookOptions<AddBranchResult, any>,
) {
  const { toast } = useToast();
  const [handleAdd, { loading, error }] = useMutation(ADD_BRANCH, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<BranchData>({
          query: GET_BRANCHES_LIST,
        });
        if (!existingData || !existingData.branchesMain || !data?.branchesAdd)
          return;

        cache.writeQuery<BranchData>({
          query: GET_BRANCHES_LIST,
          data: {
            branchesMain: {
              ...existingData.branchesMain,
              list: [data.branchesAdd, ...existingData.branchesMain.list],
              totalCount: existingData.branchesMain.totalCount + 1,
            },
          },
        });
      } catch (e) {
        console.log('error', e);
      }
    },
  });

  return {
    handleAdd,
    loading,
    error,
  };
}

export function useBranchEdit(
  options?: MutationHookOptions<AddBranchResult, any>,
) {
  const { toast } = useToast();
  const [handleEdit, { loading, error }] = useMutation(EDIT_BRANCH, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<BranchData>({
          query: GET_BRANCHES_LIST,
        });
        if (!existingData || !existingData.branchesMain || !data?.branchesEdit)
          return;

        cache.writeQuery<BranchData>({
          query: GET_BRANCHES_LIST,
          data: {
            branchesMain: {
              ...existingData.branchesMain,
              list: [data.branchesEdit, ...existingData.branchesMain.list],
              totalCount: existingData.branchesMain.totalCount + 1,
            },
          },
        });
      } catch (e) {
        console.log('error', e);
      }
    },
  });

  return {
    handleEdit,
    loading,
    error,
  };
}

export function useRemoveBranch() {
  const { toast } = useToast();
  const [handleRemove, { loading, error }] = useMutation(REMOVE_BRANCHES, {
    onCompleted: () => toast({ title: 'Removed successfully!' }),
    refetchQueries: [GET_BRANCHES_LIST],
  });

  return {
    handleRemove,
    loading,
    error,
  };
}
