import { RouterProvider } from 'react-router';

import { RecoilRoot } from 'recoil';

import { Toaster } from 'erxes-ui/components';

import { useCreateRouter } from '@/app/hooks/useCreateRouter';
import { AppI18nWrapper } from '~/providers/i18next-provider';
import { ThemeProvider } from '~/providers/theme-provider';

export function App() {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <AppI18nWrapper>
          <Toaster />
          <RouterProvider router={useCreateRouter()} />
        </AppI18nWrapper>
      </ThemeProvider>
    </RecoilRoot>
  );
}
