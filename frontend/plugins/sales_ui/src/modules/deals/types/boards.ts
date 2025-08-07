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
  onValueChange?: (Boards?: string[] | string) => void;
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
  selectedBoards: IBoard[];
  setSelectedBoards: (Boards: IBoard[]) => void;
  value?: string[] | string;
  onSelect: (Boards: IBoard) => void;
  newBoardName: string;
  setNewBoardName: (BoardName: string) => void;
  mode: 'single' | 'multiple';
}

export type TBoardForm = z.infer<typeof BOARD_CREATE_SCHEMA>;
