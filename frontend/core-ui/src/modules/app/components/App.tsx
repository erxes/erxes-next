import { Toaster } from 'erxes-ui/components';

import { AppRouter } from './AppRoutes';

import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { AppI18nWrapper } from '~/providers/i18next-provider';
import { ThemeProvider } from 'erxes-ui/modules/theme-provider';
import { Provider as JotaiProvider } from 'jotai';

export function App() {
  return (
    <JotaiProvider>
      <AppErrorBoundary>
        <ThemeProvider>
          <AppI18nWrapper>
            <Toaster />
            <AppRouter />
          </AppI18nWrapper>
        </ThemeProvider>
      </AppErrorBoundary>
    </JotaiProvider>
  );
}
