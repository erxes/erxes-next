import { QueryHookOptions, useQuery } from "@apollo/client";

import { GET_BOARDS } from "@/deals/graphql/queries/BoardsQueries";
import { IBoard } from "@/deals/types/boards";

export const useBoards = (
    options?: QueryHookOptions<{ salesBoards: IBoard[] }>,
  ) => {  
    const { data, loading, error } = useQuery<{ salesBoards: IBoard[] }>(
      GET_BOARDS,
      {
        ...options,
        variables: {
          ...options?.variables,
        },
      },
    );
  
    return { boards: data?.salesBoards, loading, error };
  };