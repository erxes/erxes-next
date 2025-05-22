import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const ContentSecond = lazy(() =>
  import('~/pages/content-second/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const ContentSecondMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<ContentSecond />} />
      </Routes>
    </Suspense>
  );
};

export default ContentSecondMain;
