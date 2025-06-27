import { useContext } from 'react';
import { InlineCellContext } from 'erxes-ui/modules/inline-cell/context/InlineCellContext';

export const useInlineCell = () => {
  const context = useContext(InlineCellContext);

  if (!context) {
    throw new Error(
      'useInlineCell must be used within a InlineCellContext.Provider',
    );
  }

  return context;
};
