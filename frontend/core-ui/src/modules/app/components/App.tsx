import { Toaster } from 'erxes-ui';

import { AppRouter } from './AppRoutes';

import { AppErrorBoundary } from '@/error-handler/components/AppErrorBoundary';
import { AppI18nWrapper } from '~/providers/i18next-provider';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeEffect } from '@/app/effect-components/ThemeEffect';
import { WidgetProvider } from 'ui-modules';
import { WidgetsSidebar } from '@/widgets/WidgetsSidebar';

export function App() {
  return (
    <JotaiProvider>
      <AppI18nWrapper>
        <Toaster />
        <AppErrorBoundary>
          <WidgetProvider Widget={WidgetsSidebar}>
            <AppRouter />
          </WidgetProvider>
        </AppErrorBoundary>
        <ThemeEffect />
      </AppI18nWrapper>
    </JotaiProvider>
  );
}
