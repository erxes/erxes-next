import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Class = lazy(() =>
  import('~/pages/ClassIndexPage').then((module) => ({
    default: module.default,
  })),
);

const CourseMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Class />} />
      </Routes>
    </Suspense>
  );
};

export default CourseMain;
