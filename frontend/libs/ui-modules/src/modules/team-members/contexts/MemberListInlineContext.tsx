import { IUser } from '../types/TeamMembers';
import { createContext } from 'react';

export const MemberListInlineContext = createContext<{
  members: IUser[];
  memberIds?: string[];
  loading: boolean;
}>({ members: [], memberIds: [], loading: false });
