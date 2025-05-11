import { lazy, Suspense } from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router';

import { SegmentsPath } from '@/types/paths/SegmentsPath';

const SegmentsIndexPage = lazy(() => import('~/pages/segments/List'));
const SegmentsDetailPage = lazy(() => import('~/pages/segments/Detail'));

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
