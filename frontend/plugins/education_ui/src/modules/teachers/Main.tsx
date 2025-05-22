import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const TeacherPage = lazy(() =>
  import('~/pages/TeacherIndexPage').then((module) => ({
    default: module.default,
  })),
);

const TeachersMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<TeacherPage />} />
      </Routes>
    </Suspense>
  );
};

export default TeachersMain;
