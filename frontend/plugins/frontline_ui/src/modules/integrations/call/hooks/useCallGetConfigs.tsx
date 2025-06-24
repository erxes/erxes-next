import { useQuery } from '@apollo/client';
import { CALL_GET_CONFIGS } from '../graphql/queries/callConfigQueries';

export const useCallGetConfigs = () => {
  const { data, loading } = useQuery<{
    callsGetConfigs: { _id: string; code: string; value: string }[];
  }>(CALL_GET_CONFIGS);

  const { callsGetConfigs } = data || {};

  const callConfigs: Record<string, string> = {};

  (callsGetConfigs || []).forEach(
    (conf) => (callConfigs[conf.code] = conf.value),
  );

  return { loading, callConfigs };
};
