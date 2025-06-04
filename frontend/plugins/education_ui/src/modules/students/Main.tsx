import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Student = lazy(() =>
  import('~/pages/StudentIndexPage').then((module) => ({
    default: module.default,
  })),
);

const StudentMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Student />} />
      </Routes>
    </Suspense>
  );
};

export default StudentMain;
