import { QueryHookOptions, useQuery } from '@apollo/client';

import { GET_STAGES } from '@/deals/graphql/queries/StagesQueries';
import { IStage } from '@/deals/types/stages';

export const useStages = (
  options?: QueryHookOptions<{ salesStages: IStage[] }>,
) => {
  const { data, loading, error } = useQuery<{ salesStages: IStage[] }>(
    GET_STAGES,
    {
      ...options,
      variables: {
        ...options?.variables,
      },
    },
  );

  return { stages: data?.salesStages, loading, error };
};
