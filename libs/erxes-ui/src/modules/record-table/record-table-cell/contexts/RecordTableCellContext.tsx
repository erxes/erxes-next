import { createContext, useContext } from 'react';

export const RecordTableCellContext = createContext(
  {} as {
    isInEditMode: boolean;
    setIsInEditMode: (isInEditMode: boolean) => void;
    handleSave: () => void;
    handleSelect: (value: any) => void;
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
