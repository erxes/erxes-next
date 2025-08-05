import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { MainLayout } from '@/main/MainLayout';
import { Outlet } from 'react-router-dom';
import { MyTasksPage } from '~/pages/MyTasksPage';
import { ProjectsPage } from '~/pages/ProjectsPage';
import { ProjectDetailPage } from '~/pages/ProjectDetailPage';

const taskMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route
          element={
            <div className="flex flex-col h-full overflow-hidden">
              <MainLayout children={<Outlet />} />
            </div>
          }
        >
          <Route path="/" element={<Navigate to="my-tasks" replace />} />
          <Route path="my-tasks" element={<MyTasksPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default taskMain;
