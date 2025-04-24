import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Sample = lazy(() =>
  import('~/pages/sample-first/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const SampleFirstMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Sample />} />
      </Routes>
    </Suspense>
  );
};

export default SampleFirstMain;
