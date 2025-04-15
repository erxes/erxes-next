import { useQuery } from '@apollo/client';
import React from 'react';
import { SettingsQueries } from '../graphql';

type TProps = {
  onCompleted: (data: any) => void;
  codes?: string[];
  pattern?: string;
};

const useConfigByCode = ({ onCompleted, codes, pattern }: TProps) => {
  const { data, loading, error } = useQuery(
    SettingsQueries.queryConfigsByCodes,
    {
      skip: !codes || !pattern,
      onCompleted,
    },
  );
  const configs = (data && data.configsByCode) || [];
  return {
    loading,
    configs,
    error,
  };
};

export { useConfigByCode };
