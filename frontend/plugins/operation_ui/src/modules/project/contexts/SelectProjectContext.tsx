import { IProject } from '@/project/types';
import { createContext, useContext } from 'react';

interface SelectProjectContextType {
  value?: string;
  onValueChange: (value: string) => void;
  projects: IProject[];
  handleFetchMore: () => void;
  totalCount?: number;
}

export const SelectProjectContext = createContext<
  SelectProjectContextType | undefined
>(undefined);

export const useSelectProjectContext = () => {
  const context = useContext(SelectProjectContext);
  if (!context) {
    throw new Error(
      'useSelectProjectContext must be used within a SelectProjectProvider',
    );
  }
  return context;
};
