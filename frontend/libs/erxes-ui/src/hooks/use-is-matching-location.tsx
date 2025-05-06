import { useCallback } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

export const useIsMatchingLocation = (basePath?: string) => {
  const location = useLocation();

  console.log(location.pathname);

  return useCallback(
    (path: string) => {
      const constructedPath = basePath
        ? new URL(basePath + path, document.location.origin).pathname ?? ''
        : path;

      console.log(constructedPath, 'location', location.pathname, 'hi');

      return !!matchPath(constructedPath, location.pathname);
    },
    [location.pathname, basePath],
  );
};
