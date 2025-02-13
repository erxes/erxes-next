import { useCallback } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { AppPath } from '@/types/paths/AppPath';

export const useIsMatchingLocation = () => {
  const location = useLocation();

  return useCallback(
    (path: string, basePath?: AppPath) => {
      const constructedPath = basePath
        ? new URL(basePath + path, document.location.origin).pathname ?? ''
        : path;

      return !!matchPath(constructedPath, location.pathname);
    },
    [location.pathname],
  );
};
