import { createContext, useContext } from 'react';
import type { CellContext } from '@tanstack/react-table';

export const RecordTableCellContext = createContext(
  {} as CellContext<any, any> & {
    isInEditMode: boolean;
    setIsInEditMode: (isInEditMode: boolean) => void;
    value: string;
    setValue: (value: string) => void;
    onCloseEditMode: () => void;
    onSubmit: (value: string) => void;
  }
);

export const useRecordTableCellContext = () => {
  const context = useContext(RecordTableCellContext);
  if (!context) {
    throw new Error(
      'useRecordTableCellContext must be used within a RecordTableCellProvider'
    );
  }
  return context;
};
