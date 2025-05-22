import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const ContentFirst = lazy(() =>
  import('~/pages/content-first/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const ContentFirstMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<ContentFirst />} />
      </Routes>
    </Suspense>
  );
};

export default ContentFirstMain;
