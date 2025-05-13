import { useQuery, gql } from '@apollo/client';
import { queries } from '~/modules/graphql';
import { PosDetailQueryResponse } from '../types/detail';


export function usePosDetail(posId?: string) {
  const { loading, error, data, refetch } = useQuery<PosDetailQueryResponse>(
    gql(queries.posDetail),
    {
      skip: !posId,
      fetchPolicy: "cache-and-network",
      variables: {
        _id: posId || "",
        posId: posId || "",
      },
      errorPolicy: "all",
      onError: (error) => {
        console.error("PosDetail query error:", error.message);
      }
    }
  );

  const permissionError = error?.graphQLErrors?.some(
    e => e.message === "Permission required" || e.extensions?.code === "INTERNAL_SERVER_ERROR"
  );

  return {
    loading,
    error,
    permissionError,
    posDetail: data?.posDetail,
    refetch
  };
}