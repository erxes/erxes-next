import { createContext } from 'react';
import { IChannelContext } from '../types/Channel';

export const MultipleSelectChannelContext = createContext<IChannelContext>(
  {} as IChannelContext,
);
