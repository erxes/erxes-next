import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const SampleModule = lazy(() =>
  import('~/pages/sample-module/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const SampleModuleMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<SampleModule />} />
      </Routes>
    </Suspense>
  );
};

export default SampleModuleMain;
