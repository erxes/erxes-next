import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { Providers } from '~/providers';
import { DefaultLayout } from '@/ui/components/DefaultLayout';
import { AppPath } from '@/types/AppPath';
import { SettingsRoutes } from '../components/SettingsRoutes';
import { lazy, Suspense } from 'react';
import ProductsRoutes from '../components/ProductsRoutes';

const Inbox = lazy(() => import('plugin_inbox/Module'));

export const useCreateRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Providers />} loader={async () => Promise.resolve(null)}>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<></>} />
          <Route
            path={AppPath.InboxCatchAll}
            element={
              <Suspense fallback={<></>}>
                <Inbox />
              </Suspense>
            }
          />
          <Route path={AppPath.SettingsCatchAll} element={<SettingsRoutes />} />
          <Route path={AppPath.ProductsCatchAll} element={<ProductsRoutes />} />
        </Route>
      </Route>
    )
  );
};
