import { createContext } from 'react';

import { ThemeContextValue } from 'erxes-ui/modules/theme-provider/types/themeTypes';

export const ThemeContext = createContext<ThemeContextValue | null>(null);
