import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import { ErrorFallback } from '@/error-handler/ErrorFallback';

export const AppErrorBoundary = ({ children }: { children: ReactNode }) => {
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
      {children}
    </ErrorBoundary>
  );
};
