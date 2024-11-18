import { ThemeProvider } from './theme-provider';
import { AppAI18nWrapper } from './i18next-provider';
import { Outlet } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

export const Providers = () => {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <AppAI18nWrapper>
          <Outlet />
        </AppAI18nWrapper>
      </ThemeProvider>
    </RecoilRoot>
  );
};
