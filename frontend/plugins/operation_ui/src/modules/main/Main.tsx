import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { MainLayout } from '@/main/MainLayout';
import { Outlet } from 'react-router-dom';
import { TasksPage } from '~/pages/TasksPage';
import { ProjectsPage } from '~/pages/ProjectsPage';
import { ProjectDetailPage } from '~/pages/ProjectDetailPage';
import { ProjectLayout } from '@/project/components/ProjectLayout';
import { TaskPageTypes } from '@/task/types';
import { ProjectPageTypes } from '@/project/types';
import { TasksLayout } from '@/task/components/TasksLayout';

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
          <Route path="/" element={<Navigate to="tasks" replace />} />
          <Route path="tasks" element={<TasksLayout />}>
            <Route index element={<TasksPage type={TaskPageTypes.All} />} />
          </Route>
          <Route
            path="projects"
            element={<ProjectsPage type={ProjectPageTypes.All} />}
          />
          <Route path="projects/:projectId" element={<ProjectLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ProjectDetailPage />} />
            <Route path="tasks" element={<ProjectDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default taskMain;
