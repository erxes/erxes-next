import { Toaster } from 'erxes-ui/components';

import { AppRouter } from './AppRoutes';

import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { AppI18nWrapper } from '~/providers/i18next-provider';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeEffect } from '@/app/effect-components/ThemeEffect';

export function App() {
  return (
    <JotaiProvider>
      <AppErrorBoundary>
        <AppI18nWrapper>
          <Toaster />
          <AppRouter />
          <ThemeEffect />
        </AppI18nWrapper>
      </AppErrorBoundary>
    </JotaiProvider>
  );
}
