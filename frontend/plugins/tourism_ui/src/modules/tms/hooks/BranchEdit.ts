import { useMutation } from '@apollo/client';
import { EDIT_BRANCH } from '../graphql/mutation';
import { GET_BRANCH_LIST } from '../graphql/queries';
import { IBranch } from '../types/branch';

interface EditBranchResponse {
  bmsBranchEdit: IBranch;
}

export interface IEditBranchVariables {
  id: string;
  name?: string;
  description?: string;
  generalManagerIds?: string[];
  managerIds?: string[];
  paymentIds?: string[];
  paymentTypes?: any[];
  departmentId?: string;
  token?: string;
  erxesAppToken?: string;
  permissionConfig?: any[];
  uiOptions?: {
    logo?: string;
    favIcon?: string;
    colors?: {
      primary?: string;
    };
  };
}

export const useBranchEdit = () => {
  const [editBranchMutation, { loading, error }] = useMutation<
    EditBranchResponse,
    IEditBranchVariables
  >(EDIT_BRANCH, {
    refetchQueries: [
      {
        query: GET_BRANCH_LIST,
        variables: {
          limit: 10,
        },
      },
    ],
    onError: (error) => {
      // Replace with proper error logging service
      console.error('Branch edit failed:', error);
    },
  });

  const editBranch = (options: {
    variables: IEditBranchVariables;
    onCompleted?: (data: EditBranchResponse) => void;
    onError?: (error: any) => void;
  }) => {
    return editBranchMutation(options);
  };

  return {
    editBranch,
    loading,
    error,
  };
};
