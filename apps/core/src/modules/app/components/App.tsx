import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '~/providers/theme-provider';
import { AppI18nWrapper } from '~/providers/i18next-provider';
import { Toaster } from 'erxes-ui/components';
import { AppRouter } from './AppRoutes';
import { AppErrorBoundary } from '@/error-handler/AppErrorBoundary';

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
