import { useQuery } from '@apollo/client';
import { GET_BRANCH_LIST } from '../graphql/queries';
import { IBranch } from '../types/branch';

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

interface BranchListResponse {
  bmsBranchList: {
    list: IBranch[];
    totalCount: number;
    pageInfo: PageInfo;
  };
}

export const useBranchList = (page = 1, limit = 10) => {
  const { data, loading, error, refetch } = useQuery<BranchListResponse>(
    GET_BRANCH_LIST,
    {
      variables: {
        limit,
        page,
      },
      fetchPolicy: 'network-only',
    },
  );

  const list = data?.bmsBranchList?.list || [];
  const totalCount = data?.bmsBranchList?.totalCount || 0;
  const pageInfo = data?.bmsBranchList?.pageInfo;

  return { list, totalCount, pageInfo, loading, error, refetch };
};
