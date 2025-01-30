import { useEffect, useState } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';

import { isDeeplyEqual } from 'erxes-ui/utils';

type GenericErrorFallbackProps = FallbackProps & {
  title?: string;
};

export const GenericErrorFallback = ({
  resetErrorBoundary,
  error,
  title = 'Sorry, something went wrong',
}: GenericErrorFallbackProps) => {
  const location = useLocation();

  const [previousLocation] = useState(location);

  useEffect(() => {
    if (!isDeeplyEqual(previousLocation, location)) {
      resetErrorBoundary();
    }
  }, [previousLocation, location, resetErrorBoundary]);

  return <div>{title}<div>{error.message}</div></div>;
};
