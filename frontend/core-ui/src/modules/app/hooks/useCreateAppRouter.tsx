import { lazy } from 'react';
import {
  createRoutesFromElements,
  Route,
  createBrowserRouter,
} from 'react-router-dom';

import { ContactsRoutes } from '@/app/components/ContactsRoutes';
import { ProductsRoutes } from '@/app/components/ProductsRoutes';
import { SettingsRoutes } from '@/app/components/SettingsRoutes';
import { getPluginsRoutes } from '@/app/hooks/usePluginsRouter';
import { UserProvider } from '@/auth/providers/UserProvider';
import { OrganizationProvider } from '@/organization/providers/OrganizationProvider';
import { AppPath } from '@/types/paths/AppPath';
import { DefaultLayout } from '@/app/components/MainLayout';
import { NotFoundPage } from '~/pages/not-found/NotFoundPage';
import { OnBoarding } from '~/pages/onboarding/Onboarding';
import { Providers } from '~/providers';
import ForgotPasswordPage from '~/pages/auth/ForgotPasswordPage';
import { SegmentRoutes } from '@/app/components/SegmentsRoutes';
import { AutomationRoutes } from '@/app/components/AutomationRoutes';
import { LogRoutes } from '@/app/components/LogRoutes';
import { ComponentsRoutes } from '../components/ComponentsRoutes';

const LoginPage = lazy(() => import('~/pages/auth/LoginPage'));

const ResetPasswordPage = lazy(() => import('~/pages/auth/ResetPasswordPage'));

const CreateOwnerPage = lazy(
  () => import('~/pages/organization/CreateOwnerPage'),
);
export const useCreateAppRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Providers />} loader={async () => Promise.resolve(null)}>
        <Route path={AppPath.CreateOwner} element={<CreateOwnerPage />} />
        <Route element={<OrganizationProvider />}>
          <Route path={AppPath.Login} element={<LoginPage />} />
          <Route
            path={AppPath.ForgotPassword}
            element={<ForgotPasswordPage />}
          />
          <Route path={AppPath.ResetPassword} element={<ResetPasswordPage />} />

          <Route element={<UserProvider />}>
            <Route element={<DefaultLayout />}>
              <Route path={AppPath.Index} element={<OnBoarding />} />
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
              <Route
                path={AppPath.SegmentsCatchAll}
                element={<SegmentRoutes />}
              />
              <Route
                path={AppPath.AutoamtionsCatchAll}
                element={<AutomationRoutes />}
              />
              <Route path={AppPath.LogsCatchAll} element={<LogRoutes />} />
              {...getPluginsRoutes()}
              {process.env.NODE_ENV === 'development' && (
                <Route
                  path={AppPath.ComponentsCatchAll}
                  element={<ComponentsRoutes />}
                />
              )}
            </Route>
          </Route>
        </Route>
        <Route path={AppPath.NotFoundWildcard} element={<NotFoundPage />} />
      </Route>,
    ),
  );
};
