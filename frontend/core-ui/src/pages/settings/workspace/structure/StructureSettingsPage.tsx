import { StructureSettingsBreadcrumb } from '@/settings/structure/components/StructureSettingsBreadcrumb';
import { StructureSidebar } from '@/settings/structure/components/StructureSidebar';
import { StructureTopbar } from '@/settings/structure/components/StructureTopbar';
import { SettingsHeader, Spinner } from 'erxes-ui';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

export const StructureMain = lazy(() =>
  import('~/modules/settings/structure/components/Structure').then(
    (module) => ({
      default: module.Structure,
    }),
  ),
);
export const BranchesSettings = lazy(() =>
  import(
    '~/modules/settings/structure/components/branches/BranchesSettings'
  ).then((module) => ({
    default: module.default,
  })),
);
export const DepartmentsSettings = lazy(() =>
  import('~/pages/settings/workspace/structure/DepartmentsSettingsPage').then(
    (module) => ({
      default: module.DepartmentsSettingsPage,
    }),
  ),
);
export const UnitsSettings = lazy(() =>
  import('~/pages/settings/workspace/structure/UnitsSettingsPage').then(
    (module) => ({
      default: module.UnitsSettingsPage,
    }),
  ),
);
export const PositionsSettings = lazy(() =>
  import('~/pages/settings/workspace/structure/PositionsSettingsPage').then(
    (module) => ({
      default: module.PositionsSettingsPage,
    }),
  ),
);

export function StructureSettingsPage() {
  return (
    <section className="mx-auto flex w-full h-screen relative">
      <div className="flex flex-col flex-auto overflow-hidden">
        <SettingsHeader breadcrumbs={<StructureSettingsBreadcrumb />}>
          <StructureTopbar />
        </SettingsHeader>
        <div className="flex flex-auto overflow-hidden">
          <StructureSidebar />
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<StructureMain />} />
              <Route path="branches" element={<BranchesSettings />} />
              <Route path="departments" element={<DepartmentsSettings />} />
              <Route path="units" element={<UnitsSettings />} />
              <Route path="positions" element={<PositionsSettings />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
