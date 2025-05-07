import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Course = lazy(() =>
  import('~/pages/CourseIndexPage').then((module) => ({
    default: module.default,
  })),
);

const CourseMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Course />} />
      </Routes>
    </Suspense>
  );
};

export default CourseMain;
