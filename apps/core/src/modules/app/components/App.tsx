import { RouterProvider } from 'react-router-dom';
import { useCreateRouter } from '../hooks/useCreateRouter';

export function App() {
  return <RouterProvider router={useCreateRouter()} />;
}
