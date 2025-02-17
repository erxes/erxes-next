import { createContext } from 'react';
import { InlineCellContextTypes } from 'erxes-ui/modules/inline-cell/types/InlineCellContextTypes';

export const InlineCellContext = createContext<InlineCellContextTypes | null>(
  null,
);
