import { createContext, useContext } from 'react';

import { ISelectTagsContext } from '@/tags/types/tagTypes';

export const SelectTagsContext = createContext<ISelectTagsContext | null>(null);

export const SelectTagsProvider = SelectTagsContext.Provider;

export function useSelectTags() {
  const context = useContext(SelectTagsContext);
  if (!context) {
    throw new Error('useSelectTags must be used within a SelectTagsProvider');
  }
  return context;
}
