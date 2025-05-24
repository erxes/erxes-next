import { OperationVariables, useQuery } from '@apollo/client';
import React from 'react';
import { GET_TAG_DETAIL } from '../graphql/queries/tagsQueries';

export const useTagDetail = (options: OperationVariables) => {
  const { data, loading, error } = useQuery(GET_TAG_DETAIL, options);
  const tagDetail = data?.tagDetail || {};

  return {
    tagDetail,
    loading,
    error,
  };
};
