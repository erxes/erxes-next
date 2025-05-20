import { OperationVariables, useQuery } from '@apollo/client';
import React from 'react';
import { GET_BRAND_BY_ID } from '../graphql';

export const useBrandById = (options: OperationVariables) => {
  const { data, error, loading } = useQuery(GET_BRAND_BY_ID, {
    ...options,
    skip: !options?.variables.id,
  });
  return {
    brand: data?.brandDetail || {},
    loading,
    error,
  };
};
