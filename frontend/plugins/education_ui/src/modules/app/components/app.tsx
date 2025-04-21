import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const CoursesIndexPage = lazy(() =>
  import('~/pages/courses/CoursesIndexPage').then((module) => ({
    default: module.CoursesIndexPage,
  })),
);

const PluginSample = () => {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path="/" element={<CoursesIndexPage />} />
      </Routes>
    </Suspense>
  );
};

export default PluginSample;
