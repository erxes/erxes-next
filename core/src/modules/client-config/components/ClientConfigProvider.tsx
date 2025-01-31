import { clientConfigApiStatusState } from 'erxes-shared-states';
import { useRecoilValue } from 'recoil';

import { ClientConfigError } from '@/error-handler/components/ClientConfigError';

export const ClientConfigProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { isLoaded, isErrored, error } = useRecoilValue(
    clientConfigApiStatusState
  );

  if (!isLoaded) return null;

  return isErrored && error instanceof Error ? (
    <ClientConfigError error={error} />
  ) : (
    children
  );
};
