import { PropsWithChildren } from 'react';
import { ThemeProvider } from './theme-provider';
import { AppAI18nWrapper } from './i18next-provider';

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <AppAI18nWrapper>{children}</AppAI18nWrapper>
    </ThemeProvider>
  );
};

export default Providers;
