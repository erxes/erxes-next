import { RouterProvider } from 'react-router-dom';
import { useCreateRouter } from '../hooks/useCreateRouter';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '~/providers/theme-provider';
import { AppAI18nWrapper } from '~/providers/i18next-provider';

export function App() {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <AppAI18nWrapper>
          <RouterProvider router={useCreateRouter()} />
        </AppAI18nWrapper>
      </ThemeProvider>
    </RecoilRoot>
  );
}
