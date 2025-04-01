import { createContext } from 'react';
import { IMemberGroupContext } from '../types/TeamMembers';

export const SelectUsersGroupContext = createContext<IMemberGroupContext>(
  {} as IMemberGroupContext,
);
