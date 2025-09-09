import { MutationHookOptions, OperationVariables } from "@apollo/client";

import { BOARD_CREATE_SCHEMA } from "@/deals/schemas/boardFormSchema";
import { IPipeline } from "@/deals/types/pipelines";
import { z } from "zod";

export interface IBoard {
    _id: string;
    name: string;
    pipelines?: IPipeline[];
  }
  
export interface IBoardCount {
    _id: string;
    name: string;
    count: number;
}     

export type ISelectBoardsProviderProps = {
  targetIds?: string[];
  value?: string[] | string;
  onValueChange?: (boards?: string[] | string) => void;
  mode?: 'single' | 'multiple';
  children?: React.ReactNode;
  options?: (newSelectedBoardIds: string[]) => MutationHookOptions<
    {
      BoardsMain: {
        totalCount: number;
        list: IBoard[];
      };
    },
    OperationVariables
  >;
};

export interface ISelectBoardsContext {
  onSelect: (board: IBoard) => void;
  selectedBoard?: IBoard;
  setSelectedBoard?: (board: IBoard) => void;
  selectedBoardName?: string | string[];
  setSelectedBoardName?: (name: string | string[]) => void;
}

export type TBoardForm = z.infer<typeof BOARD_CREATE_SCHEMA>;
