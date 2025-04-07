import { createContext } from 'react';
import { IMember } from '../types/TeamMembers';

export const MemberListInlineContext = createContext<{
  members: IMember[];
  memberIds: string[];
  loading: boolean;
}>({ members: [], memberIds: [], loading: false });
