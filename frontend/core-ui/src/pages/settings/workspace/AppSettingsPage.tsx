import { AppsHeader } from '@/settings/apps/components/AppsHeader';
import { AppsSettings } from '@/settings/apps/components/AppsSettings';
import { CreateToken } from '@/settings/apps/components/CreateToken';
import { PageContainer, Spinner } from 'erxes-ui';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

export function AppSettingsPage() {
  return (
    <PageContainer>
      <AppsHeader />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route index element={<AppsSettings />} />
          <Route path="create-new-app" element={<CreateToken />} />
        </Routes>
      </Suspense>
    </PageContainer>
  );
}
