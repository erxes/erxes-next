import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_CYCLE_PROGRESS_BY_PROJECT } from '@/cycle/graphql/queries/getCycleProgressByProject';
import { ICycleProgressByProject } from '@/cycle/types';

interface IGetCycleQueryResponse {
  getCycleProgressByProject: ICycleProgressByProject[];
}

export const useGetCycleProgressByProject = (options: QueryHookOptions) => {
  const { data, loading, refetch } = useQuery<IGetCycleQueryResponse>(
    GET_CYCLE_PROGRESS_BY_PROJECT,
    options,
  );

  const cycleProgressByProject = data?.getCycleProgressByProject;

  return { cycleProgressByProject, loading, refetch };
};
