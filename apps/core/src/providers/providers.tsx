import { ThemeProvider } from './theme-provider';
import { AppAI18nWrapper } from './i18next-provider';
import { Outlet } from 'react-router-dom';

export const Providers = () => {
  return (
    <ThemeProvider>
      <AppAI18nWrapper>
        <Outlet />
      </AppAI18nWrapper>
    </ThemeProvider>
  );
};
