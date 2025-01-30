import { lazy } from 'react';
import { createRoutesFromElements, Route } from 'react-router';
import { createBrowserRouter } from 'react-router';

import { ContactsRoutes } from '@/app/components/ContactsRoutes';
import { ProductsRoutes } from '@/app/components/ProductsRoutes';
import { SettingsRoutes } from '@/app/components/SettingsRoutes';
import { usePluginsRouter } from '@/app/hooks/usePluginsRouter';
import { UserProvider } from '@/auth/providers/UserProvider';
import { OrganizationProvider } from '@/organization/providers/OrganizationProvider';
import { AppPath } from '@/types/AppPath';
import { DefaultLayout } from '@/ui/components/DefaultLayout';
import { NotFoundPage } from '~/pages/not-found/NotFoundPage';
import { Providers } from '~/providers';

const LoginPage = lazy(() => import('~/pages/auth/LoginPage'));

const ResetPasswordPage = lazy(() => import('~/pages/auth/ResetPasswordPage'));

const CreateOwnerPage = lazy(
  () => import('~/pages/organization/CreateOwnerPage')
);

export const useCreateAppRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Providers />} loader={async () => Promise.resolve(null)}>
        <Route path={AppPath.CreateOwner} element={<CreateOwnerPage />} />
        <Route element={<OrganizationProvider />}>
          <Route path={AppPath.Login} element={<LoginPage />} />
          <Route path={AppPath.ResetPassword} element={<ResetPasswordPage />} />

          <Route element={<UserProvider />}>
            <Route element={<DefaultLayout />}>
              <Route path={AppPath.Index} element={<></>} />
              <Route
                path={AppPath.SettingsCatchAll}
                element={<SettingsRoutes />}
              />
              <Route
                path={AppPath.ProductsCatchAll}
                element={<ProductsRoutes />}
              />
              <Route
                path={AppPath.ContactsCatchAll}
                element={<ContactsRoutes />}
              />
              <Route>{usePluginsRouter()}</Route>
            </Route>
          </Route>
        </Route>
        <Route path={AppPath.NotFoundWildcard} element={<NotFoundPage />} />
      </Route>
    )
  );
};
