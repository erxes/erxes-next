import { RecoilRoot } from 'recoil';

import { Toaster } from 'erxes-ui/components';

import { AppRouter } from './AppRoutes';

import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { AppI18nWrapper } from '~/providers/i18next-provider';
import { ThemeProvider } from '~/providers/theme-provider';

export function App() {
  return (
    <RecoilRoot>
      <AppErrorBoundary>
        <ThemeProvider>
          <AppI18nWrapper>
            <Toaster />
            <AppRouter />
          </AppI18nWrapper>
        </ThemeProvider>
      </AppErrorBoundary>
    </RecoilRoot>
  );
}
