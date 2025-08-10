import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { TasksPage } from '~/pages/TasksPage';
import { ProjectsPage } from '~/pages/ProjectsPage';
import { ProjectDetailPage } from '~/pages/ProjectDetailPage';
import { ProjectLayout } from '@/project/components/ProjectLayout';

const taskMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Navigate to="tasks" replace />} />
        <Route path="tasks" element={<TasksPage />} />

        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<ProjectDetailPage />} />
        </Route>

        <Route path="team/:teamId">
          <Route index element={<Navigate to="projects" replace />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksPage />} />

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
