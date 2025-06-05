import { useMutation } from '@apollo/client';
import { REMOVE_BRANDS } from '../graphql';

export const useBrandsRemove = () => {
  const [brandsRemove, { loading, error }] = useMutation(REMOVE_BRANDS, {
    refetchQueries: ['Brands'],
  });
  return {
    brandsRemove,
    loading,
    error,
  };
};
