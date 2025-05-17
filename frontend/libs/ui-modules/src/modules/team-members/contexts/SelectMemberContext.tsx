import { createContext, useContext } from 'react';
import { IMember } from '../types/TeamMembers';

export type ISelectMemberContext = {
  memberIds: string[];
  onSelect: (member: IMember) => void;
  members: IMember[];
  setMembers: (members: IMember[]) => void;
  loading: boolean;
  error: string | null;
};

export const SelectMemberContext = createContext<ISelectMemberContext | null>(
  null,
);

export const useSelectMemberContext = () => {
  const context = useContext(SelectMemberContext);
  if (!context) {
    throw new Error(
      'useSelectMemberContext must be used within a SelectMemberProvider',
    );
  }
  return context;
};
