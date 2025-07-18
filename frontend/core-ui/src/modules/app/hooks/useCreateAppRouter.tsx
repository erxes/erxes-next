import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { AppPath } from '@/types/paths/AppPath';
import { AutomationRoutes } from '@/app/components/AutomationRoutes';
import { ComponentsRoutes } from '../components/ComponentsRoutes';
import { ContactsRoutes } from '@/app/components/ContactsRoutes';
import { DefaultLayout } from '@/app/components/MainLayout';
import ForgotPasswordPage from '~/pages/auth/ForgotPasswordPage';
import { LogRoutes } from '@/app/components/LogRoutes';
import { NotFoundPage } from '~/pages/not-found/NotFoundPage';
import { OnBoarding } from '~/pages/onboarding/Onboarding';
import { OrganizationProvider } from '@/organization/providers/OrganizationProvider';
import { ProductsRoutes } from '@/app/components/ProductsRoutes';
import { Providers } from '~/providers';
import { SegmentRoutes } from '@/app/components/SegmentsRoutes';
import { SettingsRoutes } from '@/app/components/SettingsRoutes';
import { UserProvider } from '@/auth/providers/UserProvider';
import { getPluginsRoutes } from '@/app/hooks/usePluginsRouter';
import { lazy } from 'react';

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
