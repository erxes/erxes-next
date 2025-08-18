import React, { createContext, useContext } from 'react';
import { IProject } from '@/project/types';

interface SelectProjectContextType {
  projects: IProject[];
  projectIds: string[];
  onSelect: (project: IProject) => void;
  setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
  loading: boolean;
  error: string | null;
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
