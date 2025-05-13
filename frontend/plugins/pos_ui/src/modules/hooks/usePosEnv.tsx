import { useQuery, gql } from '@apollo/client';
import { queries } from '../graphql';

// Define your response type
interface PosEnvQueryResponse {
  posEnv: any; // Replace 'any' with the actual type if known
}

export function usePosEnv() {
  const { loading, error, data, refetch } = useQuery<PosEnvQueryResponse>(
    gql(queries.posEnv),
    {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all", // This will give you data even if there are errors
      onError: (error) => {
        // Log the error or handle it specifically
        console.error("PosEnv query error:", error.message);
      }
    }
  );

  // Handle the permission error specifically
  const permissionError = error?.graphQLErrors?.some(
    e => e.message === "Permission required" || e.extensions?.code === "INTERNAL_SERVER_ERROR"
  );

  return {
    loading,
    error,
    permissionError,
    posEnv: data?.posEnv,
    refetch
  };
}