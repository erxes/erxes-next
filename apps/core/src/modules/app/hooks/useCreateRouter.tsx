import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { Providers } from '~/providers';
import { DefaultLayout } from '@/ui/components/DefaultLayout';
import { AppPath } from '@/types/AppPath';
import { SettingsRoutes } from '../components/SettingsRoutes';

export const useCreateRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Providers />} loader={async () => Promise.resolve(null)}>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<></>} />
          <Route path={AppPath.SettingsCatchAll} element={<SettingsRoutes />} />
        </Route>
      </Route>
    )
  );
};
