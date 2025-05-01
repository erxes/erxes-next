import { useQuery } from '@apollo/client';
import { GET_STRUCTURE_DETAILS } from '../graphql';

export const useStructureDetails = () => {
  const { data, loading, error } = useQuery(GET_STRUCTURE_DETAILS);
  const structureDetail = data?.structureDetail || {};

  return {
    structureDetail,
    loading,
    error,
  };
};
