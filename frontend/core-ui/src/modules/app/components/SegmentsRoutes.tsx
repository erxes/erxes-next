import { lazy, Suspense } from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router';

import { SegmentsPath } from '@/types/paths/SegmentsPath';

const SegmentsIndexPage = lazy(() =>
  import('~/pages/segments/List').then((module) => ({
    default: module.default,
  })),
);

const SegmentsDetailPage = lazy(() =>
  import('~/pages/segments/Detail').then((module) => ({
    default: module.default,
  })),
);

export const SegmentRoutes = () => {
  return (
    <Suspense fallback={<>Hello World</>}>
      <Routes>
        <Route path={SegmentsPath.Index} element={<SegmentsIndexPage />} />
        <Route path={SegmentsPath.Detail} element={<SegmentsDetailPage />} />
      </Routes>
    </Suspense>
  );
};
