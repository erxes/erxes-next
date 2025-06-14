import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const SampleSecond = lazy(() =>
  import('~/pages/sample-second/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const SampleSecondMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<SampleSecond />} />
      </Routes>
    </Suspense>
  );
};

export default SampleSecondMain;
