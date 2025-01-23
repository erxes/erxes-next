import { OperationVariables, useQuery } from '@apollo/client';
import { tagsQuery } from '../graphql/queries/tagsQueries';
import { useState } from 'react';

export const useTags = (options: OperationVariables) => {
  const [persistedData, setPersistedData] = useState(null);
  const { data, loading, error } = useQuery(tagsQuery, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      setPersistedData(data);
    },
    ...options,
  });

  const displayData = data || persistedData;
  return {
    tags: displayData?.tags,
    count: displayData?.tagsQueryCount,
    loading,
    error,
  };
};
