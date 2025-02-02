import { useContext } from 'react';

import { ThemeContext } from 'erxes-ui/modules/theme-provider/context/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
