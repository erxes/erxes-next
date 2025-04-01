import { OperationVariables, useQuery } from '@apollo/client';
import { GET_USER_INLINE_DETAIL } from '../graphql/queries/userQueries';

export const useMemberInline = (options: OperationVariables) => {
  const { data, loading } = useQuery(GET_USER_INLINE_DETAIL, options);

  return {
    loading,
    memberDetail: data?.userDetail,
  };
};
