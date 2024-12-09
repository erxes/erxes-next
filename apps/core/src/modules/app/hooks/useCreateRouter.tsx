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

import { UserProvider } from '@/auth/providers/UserProvider';
import { OrganizationProvider } from '@/organization/providers/OrganizationProvider';
import Inbox from '~/plugins/Inbox';

const LoginPage = lazy(() => import('~/pages/auth/LoginPage'));
const ResetPasswordPage = lazy(() => import('~/pages/auth/ResetPasswordPage'));
const CreateOwnerPage = lazy(
  () => import('~/pages/organization/CreateOwnerPage')
);

export const useCreateRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Providers />} loader={async () => Promise.resolve(null)}>
        <Route path="/create-owner" element={<CreateOwnerPage />} />
        <Route element={<OrganizationProvider />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<UserProvider />}>
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
            <Route
              path={AppPath.SettingsCatchAll}
              element={<SettingsRoutes />}
            />
            <Route
              path={AppPath.ProductsCatchAll}
              element={<ProductsRoutes />}
            />
          </Route>
        </Route>
      </Route>
    )
  );
};
