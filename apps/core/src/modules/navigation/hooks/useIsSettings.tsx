import { useLocation } from 'react-router-dom';

export const useIsSettings = () => {
  const location = useLocation();
  return location.pathname.includes('/settings');
};
