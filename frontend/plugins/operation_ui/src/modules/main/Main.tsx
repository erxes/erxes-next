import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { MainLayout } from '@/main/MainLayout';
import { Outlet } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { IconSandbox } from '@tabler/icons-react';
import { MyTasksPage } from '~/pages/MyTasksPage';
import { ProjectsPage } from '~/pages/ProjectsPage';

const taskMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route
          element={
            <div className="flex flex-col h-full overflow-hidden">
              <PageHeader>
                <PageHeader.Start>
                  <Breadcrumb>
                    <Breadcrumb.List className="gap-1">
                      <Breadcrumb.Item>
                        <Button variant="ghost" asChild>
                          <Link to="/operation">
                            <IconSandbox />
                            Operation
                          </Link>
                        </Button>
                      </Breadcrumb.Item>
                    </Breadcrumb.List>
                  </Breadcrumb>
                  <Separator.Inline />
                  <PageHeader.FavoriteToggleButton />
                </PageHeader.Start>
              </PageHeader>
              <MainLayout children={<Outlet />} />
            </div>
          }
        >
          <Route path="/" element={<Navigate to="my-tasks" replace />} />
          <Route path="my-tasks" element={<MyTasksPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default taskMain;
