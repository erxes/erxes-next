import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const CallIndexPage = lazy(() =>
  import('~/pages/CallIndexPage').then((module) => ({
    default: module.CallIndexPage,
  })),
);
const CallDetailPage = lazy(() =>
  import('~/pages/CallDetailPage').then((module) => ({
    default: module.CallDetailPage,
  })),
);

const IntegrationsMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/calls" element={<CallIndexPage />} />
        <Route path="/calls/:id" element={<CallDetailPage />} />
      </Routes>
    </Suspense>
  );
};

export default IntegrationsMain;
