import { useMutation } from '@apollo/client';
import React from 'react';
import { REMOVE_BRANDS } from '../graphql';

export const useBrandsRemove = () => {
  const [brandsRemove, { loading, error }] = useMutation(REMOVE_BRANDS);
  return {
    brandsRemove,
    loading,
    error,
  };
};
