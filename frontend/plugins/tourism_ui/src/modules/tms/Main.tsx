import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Tms = lazy(() =>
  import('~/pages/tms/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const PreviewPage = lazy(() =>
  import('~/pages/tms/PreviewPage').then((module) => ({
    default: module.default,
  })),
);

const TmsMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Tms />} />
        <Route path="/PreviewPage" element={<PreviewPage />} />
      </Routes>
    </Suspense>
  );
};

export default TmsMain;
