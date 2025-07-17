import { NotificationSettings } from '@/notification/settings/components/NotificationSettings';
import { ErrorBoundary } from 'react-error-boundary';

export const NotificationSettingsPage = () => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <p className="text-destructive font-semibold">{error?.message}</p>
      )}
    >
      <NotificationSettings />
    </ErrorBoundary>
  );
};
