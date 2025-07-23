import { useMutation } from '@apollo/client';
import { CREATE_BRANCH } from '../graphql/mutation';
import { GET_BRANCH_LIST } from '../graphql/queries';
import { IBranch } from '../types/branch';

interface CreateBranchResponse {
  bmsBranchAdd: IBranch;
}

export interface ICreateBranchVariables {
  name: string;
  description?: string;
  generalManagerIds?: string[];
  managerIds?: string[];
  paymentIds?: string[];
  departmentId?: string;
  token?: string;
  erxesAppToken?: string;
  permissionConfig?: {
    _id?: string;
    type: string;
    title: string;
    icon: string;
    config?: string;
  }[];
  uiOptions?: {
    logo?: string;
    favIcon?: string;
    colors?: {
      primary?: string;
    };
  };
}

export const useCreateBranch = () => {
  const [createBranchMutation, { loading, error }] = useMutation<
    CreateBranchResponse,
    ICreateBranchVariables
  >(CREATE_BRANCH, {
    refetchQueries: [
      {
        query: GET_BRANCH_LIST,
        variables: {
          limit: 10,
        },
      },
    ],
  });

  const createBranch = (options: {
    variables: ICreateBranchVariables;
    onCompleted?: (data: CreateBranchResponse) => void;
    onError?: (error: any) => void;
  }) => {
    return createBranchMutation(options);
  };

  return {
    createBranch,
    loading,
    error,
  };
};
