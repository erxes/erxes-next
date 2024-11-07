import * as React from 'react';
import {
  BreadcrumbSeparator,
  BreadcrumbList,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Header,
} from 'erxes-ui';

import { Route, Routes, Outlet } from 'react-router-dom';

export function App() {
  return (
    <>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/tasks">Task</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </BreadcrumbList>
        </Breadcrumb>
      </Header>

      <React.Suspense>
        <Routes>
          <Route path="/" element={<TaskLayout />}>
            <Route index element={<TaskHome />} />
            <Route path="teams" element={<Teams />} />
            <Route path="details/:id" element={<TaskDetails />} />
          </Route>
        </Routes>
      </React.Suspense>
    </>
  );
}

function TaskLayout() {
  return (
    <div>
      <h1>Task Plugdsadin</h1>
      <Outlet /> {/* This will render nested routes */}
    </div>
  );
}

function TaskHome() {
  return <div>dasds to Tasks</div>;
}

function Teams() {
  return <div>Teams Page</div>;
}

function TaskDetails() {
  return <div>Details for Task </div>;
}

export default App;
