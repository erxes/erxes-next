import { QueryHookOptions, useQuery } from "@apollo/client";

import { GET_PIPELINE_LABEL_DETAIL } from "@/deals/graphql/queries/PipelinesQueries";
import { IPipelineLabel } from "@/deals/types/pipelines";

export const usePipelineDetails = (
    options?: QueryHookOptions<{ salesPipelineLabelDetail: IPipelineLabel }>,
  ) => {  
    const { data, loading, error } = useQuery<{ salesPipelineLabelDetail: IPipelineLabel }>(
      GET_PIPELINE_LABEL_DETAIL,
      {
        ...options,
        variables: {
          ...options?.variables,
        },
      },
    );
  
    return { pipelineLabelDetail: data?.salesPipelineLabelDetail, loading, error };
  };