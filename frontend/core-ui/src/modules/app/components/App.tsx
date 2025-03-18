import { Toaster } from 'erxes-ui';

import { AppRouter } from './AppRoutes';

import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { AppI18nWrapper } from '~/providers/i18next-provider';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeEffect } from '@/app/effect-components/ThemeEffect';

export function App() {
  return (
    <JotaiProvider>
      <AppI18nWrapper>
        <Toaster />
        <AppErrorBoundary>
          <AppRouter />
        </AppErrorBoundary>
        <ThemeEffect />
      </AppI18nWrapper>
    </JotaiProvider>
  );
}
