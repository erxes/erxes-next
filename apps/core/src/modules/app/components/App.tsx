import { RouterProvider } from 'react-router-dom';
import { useCreateRouter } from '../hooks/useCreateRouter';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '~/providers/theme-provider';
import { AppI18nWrapper } from '~/providers/i18next-provider';

export function App() {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <AppI18nWrapper>
          <RouterProvider router={useCreateRouter()} />
        </AppI18nWrapper>
      </ThemeProvider>
    </RecoilRoot>
  );
}
