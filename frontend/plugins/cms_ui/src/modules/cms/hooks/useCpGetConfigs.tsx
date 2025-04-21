import { useQuery } from '@apollo/client';
import { Cp_Configs } from '../graphql/queries/getCPconfigs';

export const useCpConfigs = () => {
  const { data, loading, error } = useQuery(Cp_Configs, {
    variables: {},
  });
  return {
    data: data || [],
    loading,
    error,
  };
};
