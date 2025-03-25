import { OperationVariables, useQuery } from '@apollo/client';
import { queries } from '../graphql';

export type TBranch = {
  _id: string;
  title: string;
  code: string;
  parentId: string;
};

const useBranch = (options?: OperationVariables) => {
  const { data, loading } = useQuery(queries.GET_BRANCHES_QUERY, {
    ...options,
    onError(error) {
      console.error(error.message);
    },
  });

  const { branches } = data || [];

  return { branches, loading };
};

export { useBranch };
