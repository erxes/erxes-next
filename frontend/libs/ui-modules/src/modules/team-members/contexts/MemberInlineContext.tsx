import { IUser } from '../types/TeamMembers';
import { createContext } from 'react';

export const MemberInlineContext = createContext<
  IUser['details'] & { loading: boolean; _id: string }
>({} as IUser['details'] & { loading: boolean; _id: string });
