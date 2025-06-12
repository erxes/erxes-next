import React from 'react';
import { OperationVariables, useQuery } from '@apollo/client';
import { useQueryState } from 'erxes-ui/hooks';
import { queries } from '@/settings/team-member/graphql';

export const useUserDetail = (options?: OperationVariables) => {
  const [userId] = useQueryState('user_id');
  const { data, error, loading } = useQuery(queries.GET_USER, {
    ...options,
    variables: {
      _id: userId,
    },
    skip: !userId,
  });
  const userDetail = data?.userDetail || {};

  return {
    userDetail,
    loading,
    error,
  };
};
