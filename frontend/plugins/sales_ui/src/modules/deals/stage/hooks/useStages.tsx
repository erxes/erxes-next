import {
  MutationHookOptions,
  QueryHookOptions,
  useMutation,
  useQuery,
} from '@apollo/client';

import { GET_STAGES } from '@/deals/graphql/queries/StagesQueries';
import { IStage } from '@/deals/types/stages';
import { UPDATE_STAGES_ORDER } from '@/deals/graphql/mutations/StagesMutations';

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

export const useStagesOrder = (options?: MutationHookOptions<any, any>) => {
  const [updateStagesOrder, { loading, error }] = useMutation(
    UPDATE_STAGES_ORDER,
    {
      ...options,
      variables: {
        ...options?.variables,
        refetchQueries: [GET_STAGES],
      },
    },
  );

  return { updateStagesOrder, loading, error };
};
