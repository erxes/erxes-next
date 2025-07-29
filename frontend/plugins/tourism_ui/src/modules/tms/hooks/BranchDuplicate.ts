import { useMutation } from '@apollo/client';
import { CREATE_BRANCH } from '../graphql/mutation';
import { GET_BRANCH_LIST } from '../graphql/queries';
import { IBranch } from '../types/branch';

interface DuplicateBranchResponse {
  bmsBranchAdd: IBranch;
}

interface IPaymentType {
  id: string;
  name: string;
}

interface IPermissionConfig {
  permission: string;
  enabled: boolean;
}

export interface IDuplicateBranchVariables {
  name: string;
  description?: string;
  generalManagerIds?: string[];
  managerIds?: string[];
  paymentIds?: string[];
  paymentTypes?: IPaymentType[];
  departmentId?: string;
  token?: string;
  erxesAppToken?: string;
  permissionConfig?: IPermissionConfig[];
  uiOptions?: {
    logo?: string;
    favIcon?: string;
    colors?: {
      primary?: string;
    };
  };
}

export const useBranchDuplicate = () => {
  const [duplicateBranchMutation, { loading, error }] = useMutation<
    DuplicateBranchResponse,
    IDuplicateBranchVariables
  >(CREATE_BRANCH, {
    refetchQueries: [
      {
        query: GET_BRANCH_LIST,
        variables: {
          limit: 10,
        },
      },
    ],
    onError: (error) => {
      console.error('Error duplicating branch:', error);
    },
  });

  const duplicateBranch = (options: {
    variables: IDuplicateBranchVariables;
    onCompleted?: (data: DuplicateBranchResponse) => void;
    onError?: (error: any) => void;
  }) => {
    return duplicateBranchMutation(options);
  };

  return { duplicateBranch, loading, error };
};
