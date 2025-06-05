import { createContext, useContext } from 'react';
import { IMember } from '../types/TeamMembers';

export interface IMembersInlineContext {
  members: IMember[];
  loading: boolean;
  memberIds?: string[];
  placeholder: string;
  updateMembers?: (members: IMember[]) => void;
}

export const MembersInlineContext = createContext<IMembersInlineContext | null>(
  null,
);

export const useMembersInlineContext = () => {
  const context = useContext(MembersInlineContext);
  if (!context) {
    throw new Error(
      'useMembersInlineContext must be used within a MembersInlineProvider',
    );
  }
  return context;
};
