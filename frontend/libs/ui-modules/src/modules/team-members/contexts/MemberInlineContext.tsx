import { createContext } from 'react';
import { IMember } from '../types/TeamMembers';

export const MemberInlineContext = createContext<
  IMember['details'] & { loading: boolean; _id: string }
>({} as IMember['details'] & { loading: boolean; _id: string });
