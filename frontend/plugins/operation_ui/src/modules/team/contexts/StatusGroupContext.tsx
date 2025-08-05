import { createContext, useContext } from 'react';
import { ITeamStatus } from '@/team/types';

interface StatusGroupContextType {
  statuses: ITeamStatus[]
}

export const StatusGroupContext = createContext<StatusGroupContextType | null>(null);


export const useStatusGroupContext = () => {
  const context = useContext(StatusGroupContext);
  if (context === null) {
    throw new Error(
      'useStatusGroupContext must be used within a StatusGroupProvider',
    );
  }
  return context;
};