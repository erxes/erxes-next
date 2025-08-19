import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { TasksPage } from '~/pages/TasksPage';
import { ProjectsPage } from '~/pages/ProjectsPage';
import { ProjectDetailPage } from '~/pages/ProjectDetailPage';
import { ProjectLayout } from '@/project/components/ProjectLayout';
import { TasksRecordTable } from '@/task/components/TasksRecordTable';
import { TaskDetailPage } from '~/pages/TaskDetailPage';

const taskMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Navigate to="tasks" replace />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="tasks/:taskId" element={<TaskDetailPage />} />

        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<TasksRecordTable />} />
        </Route>

        <Route path="team/:teamId">
          <Route index element={<Navigate to="projects" replace />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksPage />} />

          <Route path="tasks/:taskId" element={<TaskDetailPage />} />

          <Route path="projects/:projectId" element={<ProjectLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ProjectDetailPage />} />
            <Route path="tasks" element={<TasksRecordTable />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default taskMain;
