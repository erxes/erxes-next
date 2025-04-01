import { useContext } from 'react';
import { MultipleSelectChannelContext } from '../contexts/MultipleSelectChannelContext';

export const useMultipleSelectChannelContext = () => {
  return useContext(MultipleSelectChannelContext);
};
