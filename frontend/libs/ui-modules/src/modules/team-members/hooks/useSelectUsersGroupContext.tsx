import { useContext } from 'react';
import { SelectUsersGroupContext } from '../contexts/SelectUsersGroupContext';

export const useSelectUsersGroupContext = () => {
  return useContext(SelectUsersGroupContext);
};
