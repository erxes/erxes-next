import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import { useCreateAppRouter } from '@/app/hooks/useCreateAppRouter';

export const AppRouter = () => {
  const router = useMemo(() => useCreateAppRouter(), []);

  return <RouterProvider router={router} />;
};
