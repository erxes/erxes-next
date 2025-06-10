import { createContext, useContext } from 'react';

import { IUser } from '../types/TeamMembers';

export interface IUsersInlineContext {
  members: IUser[];
  loading: boolean;
  memberIds?: string[];
  placeholder: string;
  updateMembers?: (members: IUser[]) => void;
}

export const MembersInlineContext = createContext<IUsersInlineContext | null>(
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
